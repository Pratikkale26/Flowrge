FROM oven/bun:1.1.30 as base

WORKDIR /app

COPY package.json bun.lock* turbo.json ./
COPY packages/common/package.json packages/common/package.json
COPY packages/db/package.json packages/db/package.json
COPY apps/indexer/package.json apps/indexer/package.json
RUN bun install --frozen-lockfile || bun install

COPY packages ./packages
COPY apps/indexer ./apps/indexer

WORKDIR /app/apps/indexer
RUN bun run build

ENV NODE_ENV=production

CMD ["bun", "run", "start"]


