##
# Storefront Dockerfile
#
# This Dockerfile builds a production image for your Next.js storefront.  It
# installs dependencies, builds the application and runs it using the default
# `next start` script.  The final image exposes port 3000.

# Stage 1: install dependencies and build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency descriptors.  This pattern works for npm, pnpm or yarn.
COPY package*.json ./
COPY pnpm-lock.yaml* ./
COPY yarn.lock* ./

# Install dependencies (production only)
RUN npm install

# Copy the rest of your storefront source code into the build context
COPY . .

# Build the production Next.js application.  This assumes your package.json
# defines a `build` script that runs `next build` under the hood.
RUN npm run build

# Stage 2: create the runtime image
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Expose the default Next.js port
EXPOSE 3000

# Copy built application from the builder stage
COPY --from=builder /app .

# Start the Next.js server.  This uses the default `next start` script
# provided by the Next.js starter template.
CMD ["npm", "run", "start"]