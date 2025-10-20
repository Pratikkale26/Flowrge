FROM node:20.18.0-alpine AS base

WORKDIR /app

# Install dependencies with workspace awareness (exclude bun lockfile)
COPY package.json package-lock.json* turbo.json ./
COPY packages/common/package.json packages/common/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY apps/web/package.json apps/web/package.json
# Ensure Corepack is available for Next's yarn registry check, but use npm for installs
RUN corepack enable && npm install --legacy-peer-deps

# Copy source and build
COPY packages ./packages
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]


