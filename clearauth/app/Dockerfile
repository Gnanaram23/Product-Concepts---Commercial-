# ClearAuth: API server and web app in one container.
#   docker build -t clearauth .
#   docker run -p 8080:8080 clearauth            -> http://localhost:8080
#   docker run -p 8080:8080 -e LLM_API_KEY=... clearauth   (optional LLM)

FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
ENV NODE_ENV=production
RUN pnpm --filter @workspace/clearauth run build \
 && pnpm --filter @workspace/api-server run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build /app/artifacts/api-server/dist ./server
COPY --from=build /app/artifacts/clearauth/dist/public ./public
ENV STATIC_DIR=/app/public
EXPOSE 8080
USER node
CMD ["node", "--enable-source-maps", "server/index.mjs"]
