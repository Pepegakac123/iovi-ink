# -------- Builder --------
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Install Bun
RUN curl -fsSL https://bun.com/install | bash
ENV BUN_INSTALL=/root/.bun
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Install deps for sharp etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 ca-certificates git \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests and install
COPY package.json bun.lock ./ 
RUN bun install --frozen-lockfile

# Copy app source
COPY . .

# Build Next.js (standalone)
ENV NODE_ENV=production
RUN bun run build

# -------- Runner --------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN groupadd -g 1001 nodejs && useradd -r -u 1001 -g nodejs nextjs

# Copy standalone build
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=3000
EXPOSE 3000

USER nextjs
CMD ["node", "server.js"]
