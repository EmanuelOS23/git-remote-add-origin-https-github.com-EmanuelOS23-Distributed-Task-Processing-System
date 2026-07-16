FROM node:20-alpine AS builder

WORKDIR /app

# Copia root package.json e lockfile
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/prisma/package*.json ./packages/prisma/
COPY apps/gateway/package*.json ./apps/gateway/

RUN npm install

# Copia o restante do código
COPY . .

# Gera o client do prisma e constrói o monorepo
RUN npm run db:generate --workspace=@task-system/prisma
RUN npm run build --workspace=@task-system/gateway

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/prisma/node_modules ./packages/prisma/node_modules
COPY --from=builder /app/packages/prisma/dist ./packages/prisma/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/gateway/dist ./apps/gateway/dist
COPY --from=builder /app/apps/gateway/package*.json ./apps/gateway/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/gateway/dist/index.js"]
