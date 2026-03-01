# Build from root to access pnpm-lock.yaml
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9.14.2

WORKDIR /app

# Copy root files (from parent context)
COPY ../pnpm-lock.yaml ../pnpm-workspace.yaml ../package.json ../turbo.json ./
COPY ../packages/shared-schema/package.json ../packages/shared-schema/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY ../packages/shared-schema ../packages/shared-schema
COPY . ./

# Build shared-schema first
RUN pnpm --filter shared-schema build

# Build frontend
RUN pnpm --filter frontend build

# Production image
FROM node:22-alpine AS runner

RUN npm install -g pnpm@9.14.2

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
