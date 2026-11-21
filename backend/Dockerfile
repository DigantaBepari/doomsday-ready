FROM node:22-bookworm-slim AS build

WORKDIR /app

# better-sqlite3 uses a prebuilt native binary when available and can compile from source otherwise.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build \
  && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_PATH=/data/doomsday-ready.db

WORKDIR /app
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

RUN mkdir -p /data && chown node:node /data
USER node

EXPOSE 3000
CMD ["node", "dist/src/server.js"]
