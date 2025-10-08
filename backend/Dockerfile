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

# Install dependencies with npm in production mode.  You can switch
# to `yarn install --frozen-lockfile` if you use Yarn.
RUN npm install --production

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

# If your Medusa backend requires a build step (e.g. TypeScript)
# ensure a `build` script exists in package.json.  The build
# typically outputs compiled files into `.medusa/server`.
RUN if [ -f package.json ] && grep -q '"build"' package.json; then npm run build; fi

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

# Start Medusa application.  If you built the project this will run the
# compiled server from `.medusa/server`.  Otherwise it falls back to
# running from source.
#
# You can adjust this command to your needs.  For example, if you
# include migrations or need to run `npx medusa migrations run` or
# `npm run predeploy` before starting, create a wrapper script and
# adjust the CMD accordingly.
CMD ["npm", "run", "start"]