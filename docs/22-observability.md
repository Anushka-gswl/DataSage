# 22 — Observability

## Overview

DataSage implements structured logging, application metrics, health checks, and audit logging. This document defines the observability strategy for both application and ML model monitoring.

---

## Structured Logging

### Format

All logs are JSON-structured for machine parsing:

```json
{
  "timestamp": "2026-09-21T15:30:00.123Z",
  "level": "INFO",
  "logger": "datasage.api.v1.properties",
  "message": "Property search completed",
  "request_id": "req_abc123",
  "user_id": "user-uuid",
  "method": "GET",
  "path": "/api/v1/properties",
  "status_code": 200,
  "duration_ms": 145,
  "result_count": 12
}
```

### Log Levels

| Level | When | Example |
|-------|------|---------|
| DEBUG | Detailed diagnostic info (dev only) | SQL queries, feature vector values |
| INFO | Normal operation events | Request completed, user registered, model loaded |
| WARNING | Unexpected but handled situations | Cache miss, Overpass API slow, low confidence prediction |
| ERROR | Operation failures requiring attention | DB connection failure, model prediction error |
| CRITICAL | System-level failures | App startup failure, model file missing |

### Request ID Correlation

Every request gets a unique `request_id` via middleware. This ID is:
- Added to all log entries during the request lifecycle
- Returned in error responses
- Used to correlate logs across services

```python
# datasage/core/middleware.py
import uuid

class RequestIDMiddleware:
    async def __call__(self, request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
```

---

## Application Metrics

### Key Metrics

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_requests_total` | Counter | method, path, status | Request volume |
| `http_request_duration_seconds` | Histogram | method, path | Latency distribution |
| `ml_predictions_total` | Counter | model_version, classification | Prediction volume |
| `ml_prediction_duration_seconds` | Histogram | model_version | Inference latency |
| `ml_prediction_confidence` | Histogram | model_version | Confidence distribution |
| `cache_hits_total` | Counter | cache_type | Cache effectiveness |
| `cache_misses_total` | Counter | cache_type | Cache miss rate |
| `db_query_duration_seconds` | Histogram | operation | DB query performance |
| `overpass_requests_total` | Counter | status | External API health |
| `active_users_gauge` | Gauge | — | Current active users |

### Implementation (Prometheus-Compatible)

```python
# datasage/core/metrics.py
from prometheus_client import Counter, Histogram, Gauge

http_requests = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "path", "status"],
)

http_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["method", "path"],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
)

ml_predictions = Counter(
    "ml_predictions_total",
    "Total ML predictions",
    ["model_version", "classification"],
)
```

### Metrics Endpoint

```
GET /metrics  → Prometheus text format
```

---

## Health Checks

### Endpoint: `GET /health`

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "checks": {
    "database": {"status": "healthy", "latency_ms": 5},
    "redis": {"status": "healthy", "latency_ms": 2},
    "ml_model": {"status": "healthy", "version": "v1.2", "loaded": true}
  },
  "timestamp": "2026-09-21T15:30:00Z"
}
```

If any check fails, `status` becomes `"degraded"` (partial failure) or `"unhealthy"` (critical failure). HTTP status: 200 for healthy/degraded, 503 for unhealthy.

---

## ML Model Monitoring

| Metric | How | Alert Threshold |
|--------|-----|----------------|
| Prediction volume | Counter per hour/day | < 50% of baseline → investigate |
| Average confidence | Rolling mean of confidence_score | < 0.6 → model may need retraining |
| MAPE on recent predictions | Compare predictions to any available actual sale prices | > 15% → alert admin |
| Feature drift (PSI) | Compare feature distributions of recent inputs vs. training data | PSI > 0.2 → significant drift |
| Classification distribution | % overpriced / fair / underpriced | > 60% in any one category → data shift |

---

## Audit Logging

Admin actions are recorded in the `audit_log` table:

| Field | Description |
|-------|-------------|
| actor_id | Admin user who performed the action |
| action | CREATE, UPDATE, DELETE, PROMOTE, ROLLBACK, ACTIVATE, DEACTIVATE |
| resource_type | user, dataset, model_version, property |
| resource_id | ID of affected resource |
| old_values | JSONB snapshot of previous state |
| new_values | JSONB snapshot of new state |
| ip_address | Admin's IP |
| created_at | Timestamp |

### Logged Actions

| Action | Resource | Details |
|--------|----------|---------|
| User role change | user | old_role → new_role |
| User deactivation | user | is_active: true → false |
| Dataset upload | dataset | filename, row count |
| Dataset activation | dataset | status: draft → active |
| Model promotion | model_version | old_active → new_active |
| Model rollback | model_version | active → previous |

---

## Log Retention

| Environment | Retention | Storage |
|-------------|-----------|---------|
| Development | 7 days | Local filesystem |
| Staging | 30 days | Cloud logging |
| Production | 90 days | Cloud logging with archive to cold storage |

---

## Related Documents

- [05 — Non-Functional Requirements](05-non-functional-requirements.md)
- [08 — Backend Architecture](08-backend-architecture.md)
- [19 — Security](19-security.md)
- [24 — Deployment](24-deployment.md)
