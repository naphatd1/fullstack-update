# Use Node.js 18 Alpine as base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Copy client environment file for build-time variables
# Only NEXT_PUBLIC_* variables will be embedded
ARG ENV_FILE=.env.production
COPY ${ENV_FILE} ./.env.production


# Install dev dependencies for build
RUN npm install

# Generate Prisma client
RUN npx prisma generate --schema=database/prisma/schema.prisma

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/database ./database

# Create uploads directory
RUN mkdir -p uploads && chown nestjs:nodejs uploads

USER nestjs

EXPOSE 4000

ENV PORT=4000

# Start the application directly
CMD ["npm", "run", "start:prod"]