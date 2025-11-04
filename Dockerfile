# Minimal Dockerfile for a Next.js app (production)
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm fetch

# Copy source
COPY . .

# Build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and node_modules from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules

# Expose port and start
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
