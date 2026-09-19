import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Firestore } from "@google-cloud/firestore";

// Initialize Privileged Server-Side Cloud Firestore Client (Google ADC)
let db: Firestore | null = null;

function getDbInstance(): Firestore {
  if (!db) {
    let projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT;
    let databaseId: string | undefined = process.env.FIREBASE_DATABASE_ID;

    if (fs.existsSync("./firebase-applet-config.json")) {
      try {
        const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
        if (config.projectId) projectId = config.projectId;
        if (config.firestoreDatabaseId) databaseId = config.firestoreDatabaseId;
      } catch (e) {
        console.error("Error reading firebase-applet-config.json:", e);
      }
    }

    const options: any = {};
    if (projectId) options.projectId = projectId;
    if (databaseId) options.databaseId = databaseId;

    db = new Firestore(options);
  }
  return db;
}

// In-memory rate limiting map (IP -> { count, resetAt })
const ipRateLimitTracker = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minute window
  const maxSubmissions = 5; // Max 5 submissions per 15 minutes per IP

  const record = ipRateLimitTracker.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimitTracker.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxSubmissions) {
    return true;
  }

  record.count += 1;
  return false;
}

// Resend Email Notification Helper
async function sendResendEmail(inquiry: any): Promise<{ status: string; details?: any }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "not_configured", details: "RESEND_API_KEY is not configured in server environment." };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "Foundry Stack <onboarding@resend.dev>";
  const toEmail = "hamza@foundrystack.net";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const textContent = `NEW PROJECT INQUIRY (${inquiry.id})
----------------------------------------
Inquiry ID: ${inquiry.id}
Date: ${inquiry.createdAt}

Client Name: ${inquiry.name}
Company: ${inquiry.company}
Email: ${inquiry.email}
Phone/WhatsApp: ${inquiry.phone}
Requested Service: ${inquiry.projectType}
Budget Expectation: ${inquiry.budget}

Project Requirements / Description:
${inquiry.description}
----------------------------------------
Submitted via Foundry Stack Project Request Form
`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border: 1px solid #1e293b; border-radius: 12px; padding: 24px;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">New Project Inquiry</h2>
          <p style="color: #94a3b8; font-family: monospace; font-size: 13px; margin: 4px 0 0 0;">ID: ${inquiry.id}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #94a3b8; width: 140px;">Client Name:</td><td style="font-weight: 600; color: #ffffff;">${inquiry.name}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Company:</td><td style="color: #ffffff;">${inquiry.company}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Email:</td><td><a href="mailto:${inquiry.email}" style="color: #38bdf8;">${inquiry.email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Phone / WhatsApp:</td><td style="color: #ffffff;">${inquiry.phone}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Requested Service:</td><td style="color: #38bdf8; font-weight: 600;">${inquiry.projectType}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Budget Expectation:</td><td style="color: #4ade80; font-weight: 600;">${inquiry.budget}</td></tr>
        </table>
        <div style="margin-top: 20px; background: #020617; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
          <h4 style="color: #94a3b8; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Project Description</h4>
          <p style="white-space: pre-wrap; margin: 0; color: #e2e8f0; font-size: 14px; line-height: 1.6;">${inquiry.description}</p>
        </div>
        <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px;">
          Foundry Stack Lead Capture System
        </div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `[New Project Inquiry] ${inquiry.id} - ${inquiry.name} (${inquiry.company || "Direct"})`,
        text: textContent,
        html: htmlContent,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const resData = await response.json();
    if (response.ok) {
      console.log(`[Resend Email] Successfully sent notification for ${inquiry.id}:`, resData);
      return { status: "sent", details: resData };
    } else {
      console.error(`[Resend Email] Failed to send notification for ${inquiry.id}:`, resData);
      return { status: "failed", details: resData };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error(`[Resend Email] Exception sending notification for ${inquiry.id}:`, err);
    return { status: "failed", details: err.message || String(err) };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] as string || req.ip || "unknown").split(",")[0].trim();

      // 1. Honeypot check (Silent drop for bot submissions)
      if (req.body.website_url_hp && req.body.website_url_hp.trim().length > 0) {
        console.warn(`[Anti-Spam] Honeypot triggered from IP ${clientIp}. Dropping payload silently.`);
        return res.json({
          success: true,
          message: "Thank you for reaching out to Foundry Stack. We have received your inquiry and will review your technical requirements promptly.",
          inquiryId: `INF-HP${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        });
      }

      // 2. Basic Rate Limiting
      if (isRateLimited(clientIp)) {
        console.warn(`[Rate Limit Exceeded] IP ${clientIp} submitted too many inquiries.`);
        return res.status(429).json({
          success: false,
          error: "Too many project inquiries submitted recently. Please wait a few minutes before submitting again.",
        });
      }

      const { name, company, email, phone, projectType, description, budget } = req.body;

      // 3. Server-side validation
      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ success: false, error: "Please enter your name." });
      }

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ success: false, error: "Please enter a valid work email address." });
      }

      if (!description || typeof description !== "string" || !description.trim()) {
        return res.status(400).json({ success: false, error: "Please provide a description of your project requirements." });
      }

      // 4. Generate Inquiry ID (Preserving format: INF-XXXXX)
      const inquiryId = `INF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const createdAt = new Date().toISOString();

      const inquiryData = {
        id: inquiryId,
        createdAt,
        name: name.trim().slice(0, 100),
        company: (company || "N/A").trim().slice(0, 100),
        email: email.trim().toLowerCase().slice(0, 150),
        phone: (phone || "N/A").trim().slice(0, 50),
        projectType: (projectType || "Websites & Web Apps").trim().slice(0, 100),
        description: description.trim().slice(0, 3000),
        budget: (budget || "Flexible").trim().slice(0, 100),
        status: "new",
        clientIp,
        notifications: {
          email: { status: "pending", timestamp: createdAt },
        },
      };

      // 5. Permanent Storage in Cloud Firestore (Source of Truth via Server Admin SDK)
      const firestore = getDbInstance();
      const docRef = firestore.collection("project_inquiries").doc(inquiryId);
      
      try {
        await docRef.set(inquiryData);
        console.log(`[Firestore] Saved project inquiry ${inquiryId} successfully.`);
      } catch (dbError: any) {
        console.error(`[Firestore Error] Failed to write inquiry ${inquiryId} to Firestore:`, dbError);
        return res.status(500).json({
          success: false,
          error: "Database storage failed. Your inquiry could not be saved at this time.",
        });
      }

      // 6. Resend Email Notification (Server-side)
      const emailStatus = await sendResendEmail(inquiryData);

      // 7. Record Email Notification Log inside the Firestore document
      try {
        await docRef.update({
          "notifications.email": {
            status: emailStatus.status,
            details: emailStatus.details || null,
            updatedAt: new Date().toISOString(),
          },
        });
      } catch (updateError) {
        console.warn(`[Firestore Update] Could not update notification status logs for ${inquiryId}:`, updateError);
      }

      // 8. Return Success to client (Since Firestore write succeeded)
      return res.json({
        success: true,
        message: "Thank you for reaching out to Foundry Stack. We have received your inquiry and will review your technical requirements promptly.",
        inquiryId,
      });

    } catch (err: any) {
      console.error("[API Contact Endpoint Error]:", err);
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred while processing your request.",
      });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      brand: "Foundry Stack",
      database: "Firestore connected",
      tagline: "Software. Systems. Solutions.",
      timestamp: new Date().toISOString(),
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Foundry Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
