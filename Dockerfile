# ─── Stage 1: Install ALL dependencies (including devDeps needed for build) ───
FROM node:20-alpine AS deps

# node-gyp (required by better-sqlite3) needs python3, make, g++
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./

# Install everything — devDeps are needed for `next build`
# This compiles better-sqlite3 against the Linux musl libc inside the container
RUN npm ci

# ─── Stage 2: Build the Next.js application ───────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy node_modules with the Linux-compiled better-sqlite3 binary
COPY --from=deps /app/node_modules ./node_modules
# Copy the full source
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─── Stage 3: Production runner — slim image ──────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DB_DIR=/app/data

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only what Next.js needs to run in standalone mode.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public         ./public

# Copy the full node_modules so better-sqlite3 native addon is present.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules   ./node_modules

# Copy seed script dependencies
COPY --from=builder --chown=nextjs:nodejs /app/src/db         ./src/db
COPY --from=builder --chown=nextjs:nodejs /app/package.json   ./package.json

# Copy entrypoint
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Create the data directory and give ownership to the app user
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
