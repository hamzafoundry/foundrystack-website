# Production image for Cloud Run.
# Build stage: install exact dependency versions, then build the client, the
# pre-rendered HTML and the server bundle (`npm run build`).
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Runtime stage: production dependencies + the built output only.
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force
COPY --from=build /app/dist ./dist
# The server reads the Firestore project and database IDs from this file at runtime.
COPY firebase-applet-config.json ./
# server.ts listens on 3000; the deploy workflow tells Cloud Run to use that port.
EXPOSE 3000
USER node
CMD ["node", "dist/server.cjs"]
