# -------- Builder --------
FROM oven/bun AS builder
WORKDIR /app

# Instalacja zależności systemowych (np. dla sharp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 ca-certificates git \
    && rm -rf /var/lib/apt/lists/*

# Kopiujemy pliki manifestu
COPY package.json bun.lock* ./

# Instalacja zależności
RUN bun install

# Kopiujemy resztę kodu
COPY . .

# Budujemy Next.js
ENV NODE_ENV=production
RUN bun run build

# -------- Runner --------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Tworzymy użytkownika
RUN groupadd -g 1001 nodejs && useradd -r -u 1001 -g nodejs nextjs

# Kopiujemy build z buildera
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=3000
EXPOSE 3000

USER nextjs
CMD ["node", "server.js"]
