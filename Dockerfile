# syntax=docker/dockerfile:1

# Base image with Node for all stages
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install deps
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# Build Next.js app
FROM deps AS builder
COPY . .
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app
ENV PORT=4012
ENV HOST=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 4012
CMD ["npm", "run", "start", "--", "-p", "4012", "-H", "0.0.0.0"]
