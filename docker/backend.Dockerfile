# ==============================================================================
# DataSage Backend — Dockerfile
# ==============================================================================
# Multi-stage build: development + production targets.
# Build:  docker build -f docker/backend.Dockerfile --target development -t datasage-backend .
# ==============================================================================

FROM python:3.11-slim AS base

WORKDIR /app

# System dependencies for asyncpg and bcrypt
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/

# Set PYTHONPATH so 'datasage' package is importable
ENV PYTHONPATH=/app/backend

# ---------- Development ----------
FROM base AS development
RUN pip install --no-cache-dir debugpy pytest pytest-asyncio httpx
CMD ["uvicorn", "datasage.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ---------- Production ----------
FROM base AS production
ENV APP_DEBUG=false
CMD ["uvicorn", "datasage.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
