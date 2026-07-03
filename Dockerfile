FROM node:26.4.0-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM caddy:2-alpine

WORKDIR /usr/share/caddy

COPY --from=builder /app/dist .

RUN printf ":8080 {\n  root * /usr/share/caddy\n  try_files {path} /index.html\n  file_server\n}\n" > Caddyfile

EXPOSE 8080

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]