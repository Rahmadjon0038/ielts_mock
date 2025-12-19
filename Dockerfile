# syntax=docker/dockerfile:1

# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat && corepack enable

# Install deps with Yarn (uses yarn.lock)
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build Next.js app
FROM deps AS builder
COPY . .
RUN yarn build

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
CMD ["yarn", "start", "-p", "4012", "-H", "0.0.0.0"]
