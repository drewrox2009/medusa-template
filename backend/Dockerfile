# This file should be at: backend/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source and build
COPY . .
RUN pnpm build

# Install production dependencies
RUN rm -rf node_modules && \
    pnpm install --frozen-lockfile --prod || pnpm install --prod

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