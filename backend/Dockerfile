# Place this file at: backend/Dockerfile
FROM node:20-alpine AS base

# Install build dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install all dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Build
RUN pnpm build || pnpm run build

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod || pnpm install --prod

# Production image
FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache wget libc6-compat

WORKDIR /app

# Copy from builder
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
COPY --from=base /app/medusa-config* ./

ENV NODE_ENV=production
EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --spider -q http://localhost:9000/health || exit 1

CMD ["sh", "-c", "pnpm run db:migrate && pnpm start"]