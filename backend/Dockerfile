# This file should be at: backend/Dockerfile

# -----------------------------
# Builder / Base
# -----------------------------
# Use Node 22 to match package.json "engines"
FROM node:22-alpine AS base
# Enable pnpm (match lockfile version) and install build deps for native modules
RUN corepack enable && corepack prepare pnpm@9.10.0 --activate && \
    apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Provide safe defaults so "pnpm build" (medusa build) doesn't fail at build-time
# These are only used during image build; real values will be provided at runtime.
ARG DATABASE_URL="postgres://medusa:medusa@localhost:5432/medusa"
ARG JWT_SECRET="changeme"
ARG COOKIE_SECRET="changeme"
ARG BACKEND_PUBLIC_URL="http://localhost:9000"
ARG ADMIN_CORS="http://localhost:7000,http://localhost:9000"
ARG STORE_CORS="http://localhost:8000"
ARG REDIS_URL=""
ENV DATABASE_URL=$DATABASE_URL \
    JWT_SECRET=$JWT_SECRET \
    COOKIE_SECRET=$COOKIE_SECRET \
    BACKEND_PUBLIC_URL=$BACKEND_PUBLIC_URL \
    ADMIN_CORS=$ADMIN_CORS \
    STORE_CORS=$STORE_CORS \
    REDIS_URL=$REDIS_URL \
    MEDUSA_TELEMETRY_DISABLED=1

# Install dependencies (use lockfile when present)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source and build Medusa (.medusa/server)
COPY . .
RUN pnpm build

# Install production deps at the repo root (for init-backend, etc.)
RUN rm -rf node_modules && \
    pnpm install --frozen-lockfile --prod || pnpm install --prod

# -----------------------------
# Production Runtime
# -----------------------------
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@9.10.0 --activate && \
    apk add --no-cache wget libc6-compat

WORKDIR /app

# Copy from builder
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.medusa/server ./.medusa/server
COPY --from=base /app/package*.json ./
COPY --from=base /app/medusa-config* ./

ENV NODE_ENV=production
EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --spider -q http://localhost:9000/health || exit 1

# Start the server (migrations handled by Medusa tooling during start)
CMD ["pnpm", "start"]
