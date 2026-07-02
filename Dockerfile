FROM node:26.4.0-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM caddy:2-alpine

WORKDIR /usr/share/caddy

COPY --from=builder /app/dist .

EXPOSE 8080

# Jalankan file server Caddy di port 8080
CMD ["caddy", "file-server", "--listen", ":8080"]