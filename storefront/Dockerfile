# This file should be at: storefront/Dockerfile
# Multi-stage build for Next.js storefront

# -----------------------------
# Base (Node + pnpm)
# -----------------------------
# Use Node 22 for parity and future-proofing
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.10.0 --activate

# -----------------------------
# Dependencies
# -----------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# -----------------------------
# Builder
# -----------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# -----------------------------
# Runner
# -----------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Only copy what is required to run
COPY --from=builder /app/next.config.js* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "start"]
