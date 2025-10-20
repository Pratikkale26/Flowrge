FROM oven/bun:1.1.30 as base

WORKDIR /app

COPY package.json bun.lock* turbo.json ./
COPY packages/common/package.json packages/common/package.json
COPY packages/db/package.json packages/db/package.json
COPY apps/hooks/package.json apps/hooks/package.json
RUN bun install --frozen-lockfile || bun install

COPY packages ./packages
COPY apps/hooks ./apps/hooks

WORKDIR /app/apps/hooks
RUN bun run build

ENV NODE_ENV=production
EXPOSE 3002

CMD ["bun", "run", "start"]


