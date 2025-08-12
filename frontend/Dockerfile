# Base image with Node.js LTS (latest)
FROM node:22-alpine AS base

# -------------------
# Install dependencies
# -------------------
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# -------------------
# Build application
# -------------------
FROM base AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Copy client environment file for build-time variables
# Only NEXT_PUBLIC_* variables will be embedded
ARG ENV_FILE=.env.local
COPY ${ENV_FILE} ./.env.local

# Build Next.js app in standalone mode
RUN npm run build

# -------------------
# Production image
# -------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy public files
COPY --from=builder /app/public ./public

# Copy standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose runtime port
EXPOSE 3000

# Server-side env variables will be passed at runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the standalone server
CMD ["node", "server.js"]
