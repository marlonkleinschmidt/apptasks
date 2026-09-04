# ---- Dependencies stage ----
# Módulos nativos (sqlite3, bcrypt) precisam de toolchain para o node-gyp.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Runtime stage ----
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Dependências já compiladas
COPY --from=deps /app/node_modules ./node_modules

# Código da aplicação
COPY . .

# Diretório do banco SQLite (montado como volume no compose)
RUN mkdir -p /app/data && chown -R node:node /app
USER node

ENV PORT=3000
ENV DB_PATH=/app/data/tasks.db
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
