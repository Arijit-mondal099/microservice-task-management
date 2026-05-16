# syntax=docker/dockerfile:1.7
#
# Multi-stage build for notification-service.
# Layers: base -> deps -> build -> prod-deps -> runtime
# Final image only carries node_modules (prod) + compiled dist/.

# ---------- Base ----------
# Pin Node to match .nvmrc / engines. Alpine for size.
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
# Corepack ships with Node 22 and respects "packageManager" in package.json.
RUN corepack enable
WORKDIR /app

# ---------- Install all deps (used by build stage) ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- Compile TypeScript -> dist/ ----------
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

# ---------- Install only production deps (smaller final image) ----------
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ---------- Runtime ----------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# 'node' user (uid 1000) ships in the official image.
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build     --chown=node:node /app/dist         ./dist
COPY                  --chown=node:node package.json ./

USER node
EXPOSE 4002

# Run the compiled entrypoint directly — no pnpm in the runtime layer.
CMD ["node", "dist/index.js"]
