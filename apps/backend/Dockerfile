FROM oven/bun:1.1.30 as base

WORKDIR /app

# Copy workspace manifests to leverage caching and install dependencies across monorepo
COPY package.json bun.lock* turbo.json ./
COPY packages/common/package.json packages/common/package.json
COPY packages/db/package.json packages/db/package.json
COPY apps/backend/package.json apps/backend/package.json
RUN bun install --frozen-lockfile || bun install

# Copy full source
COPY packages ./packages
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend
RUN bun run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["bun", "run", "start"]


