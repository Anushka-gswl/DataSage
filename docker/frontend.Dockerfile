# ==============================================================================
# DataSage Frontend — Dockerfile
# ==============================================================================

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# Copy application code
COPY frontend/ .

# ---------- Development ----------
FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# ---------- Production ----------
FROM base AS production
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "start"]
