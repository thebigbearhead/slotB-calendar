# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_PATH=/data/slotb.db
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY server ./server
COPY config ./config
COPY vite.config.js .
COPY index.html .

RUN addgroup -S app && adduser -S app -G app
RUN mkdir -p /data && chown -R app:app /app /data
USER app

EXPOSE 5000
VOLUME ["/data"]

CMD ["node", "server/server.cjs"]
