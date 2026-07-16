FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/prisma/package*.json ./packages/prisma/
COPY apps/worker/package*.json ./apps/worker/

RUN npm install

COPY . .

RUN npm run db:generate --workspace=@task-system/prisma
RUN npm run build --workspace=@task-system/worker

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/prisma/node_modules ./packages/prisma/node_modules
COPY --from=builder /app/packages/prisma/dist ./packages/prisma/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/apps/worker/package*.json ./apps/worker/

ENV NODE_ENV=production

CMD ["node", "apps/worker/dist/index.js"]
