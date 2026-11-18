# Deploying foundrystack.net

## How it works

```
pull request into main ──► GitHub Actions: type-check + build        (nothing is deployed)
merge to main          ──► GitHub Actions: type-check + build
                                         ──► deploy to Cloud Run
                                         ──► check https://foundrystack.net is serving it
```

- The site is one Express server (`server.ts`) that serves the pages and the contact form API.
  It runs on **Cloud Run**; **Firebase Hosting** puts it on the foundrystack.net domain.
- Deploys build the `Dockerfile` with Cloud Build and roll out a new Cloud Run revision.
  Settings already on the service (environment variables such as `RESEND_API_KEY`,
  secrets, its service account and its Firestore access) are kept. Only the code changes.
- GitHub signs in to Google with **Workload Identity Federation**: a short-lived token,
  no stored keys. Only pushes to `main` of `hamzafoundry/foundrystack-website` are allowed to deploy.

The workflow is `.github/workflows/deploy.yml`.

## One-time setup

1. Open **Google Cloud Shell**: <https://shell.cloud.google.com> (signed in with the Google
   account that owns project `gen-lang-client-0762399417`).
2. Run the setup script (or upload `scripts/setup-github-deploy.sh` and run it):
   ```bash
   curl -fsSL https://raw.githubusercontent.com/hamzafoundry/foundrystack-website/redesign/scripts/setup-github-deploy.sh -o setup.sh
   bash setup.sh
   ```
   It lists your Cloud Run services; type the name and region of the one serving foundrystack.net.
3. Copy the five values it prints into GitHub:
   **Settings → Secrets and variables → Actions → Variables → New repository variable**.
   Optional sixth variable: `PUBLIC_URL` (defaults to `https://foundrystack.net`).

Until those variables exist, merges to `main` will pass the checks and then fail at the
"Authenticate" step. Nothing is deployed in that case.

## Day to day

- **Publish:** open a pull request into `main`, wait for the green check, merge. The site updates
  in a few minutes; watch it under the repository's **Actions** tab.
- **Redeploy without changes:** Actions → *Check and deploy* → **Run workflow** on `main`.
- **Roll back** (in Cloud Shell): list revisions, then send all traffic to the previous one:
  ```bash
  gcloud run revisions list --service SERVICE --region REGION
  gcloud run services update-traffic SERVICE --region REGION --to-revisions PREVIOUS_REVISION=100
  ```
  Then revert the commit on `main` so the next deploy doesn't bring the problem back.

## Before the first deploy: read this

- **The live site is not the code on GitHub.** In November 2026 foundrystack.net was serving a version
  published from outside this repository (most likely Google AI Studio; its title was
  "Foundry Stack | Custom Software & AI Automation Agency", which appears in no commit).
  The first deploy from `main` **replaces** that version. Save anything you want to keep from it first.
- **Publishing from AI Studio after this** would overwrite the GitHub version again. Pick one way
  to publish. This setup assumes GitHub is it from now on.
- The contact form needs the service's existing Firestore access. If the first deploy's form
  submissions fail with "Database storage failed", check that the Cloud Run service still runs as
  the service account that has Firestore access.

## Dependency lock file

Deploys use `npm ci` with `package-lock.json` so every build installs exactly the tested versions.
`bun.lock` came from AI Studio and is not used by the deploy; if you add or upgrade packages,
use `npm install` so `package-lock.json` stays current.
