##
# Medusa backend Dockerfile
#
# This Dockerfile builds and runs a MedusaJS backend (API + admin) in a
# production ready container.  It assumes that your backend source code lives
# alongside this file and that your `package.json` defines suitable `build` and
# `start` scripts.  The container exposes port 9000 by default.

# Stage 1: install dependencies
FROM node:20-alpine AS deps

# Install build tools needed for native modules and Medusa CLI
RUN apk add --no-cache python3 make g++ bash

# Set working directory
WORKDIR /server

# Copy dependency descriptors.  The `COPY` patterns use globs so that
# either `package-lock.json`, `pnpm-lock.yaml` or `yarn.lock` will be
# included if present.  Adjust as needed for your chosen package manager.
COPY package*.json ./
COPY pnpm-lock.yaml* ./
COPY yarn.lock* ./

# Install dependencies with yarn in production mode since project uses Yarn
RUN yarn install --production --frozen-lockfile

# Stage 2: build the application
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++ bash
WORKDIR /server

# Copy installed node_modules from deps stage
COPY --from=deps /server/node_modules ./node_modules

# Copy the application source
COPY . .

# Set environment to production during build
ENV NODE_ENV=production

# Build the Medusa backend using yarn
RUN yarn build

# Stage 3: create final runtime image
FROM node:20-alpine

# Expose Medusa server port
EXPOSE 9000

# Set working directory
WORKDIR /server

# Install runtime dependencies required for Medusa CLI commands
RUN apk add --no-cache bash

# Copy built application and node_modules from builder
COPY --from=builder /server .

# Default environment
ENV NODE_ENV=production

# Start Medusa application using yarn
CMD ["yarn", "start"]