# 25 — Environment Configuration

## Overview

DataSage uses environment variables for all configuration, following the twelve-factor app methodology. This document defines the environment hierarchy, configuration management, and feature flags.

---

## Environment Hierarchy

| Setting | Development | Staging | Production |
|---------|-------------|---------|------------|
| APP_ENV | development | staging | production |
| APP_DEBUG | true | false | false |
| APP_LOG_LEVEL | DEBUG | INFO | WARNING |
| Swagger UI | Enabled | Enabled (internal) | Disabled |
| CORS origins | localhost:3000 | staging.datasage.dev | datasage.dev |
| Rate limiting | Relaxed (1000/min) | Standard (100/min) | Standard (100/min) |
| DB pool size | 5 | 10 | 20 |
| Redis maxmemory | 64mb | 256mb | 1gb |
| Sentry | Disabled | Enabled (low sample) | Enabled (0.1 sample) |
| Backups | None | Daily | Hourly |
| HTTPS | Not required | Required | Required |

---

## Configuration Loading

All config is loaded via Pydantic Settings at app startup:

```python
class Settings(BaseSettings):
    class Config:
        env_file = ".env"          # First: load .env file
        env_file_encoding = "utf-8"
        case_sensitive = True
        # Environment variables override .env file values
```

**Precedence** (highest to lowest):
1. Environment variables (set by Docker, cloud provider, or CI)
2. `.env` file values
3. Default values in the Settings class

---

## Feature Flags

Simple boolean feature flags for progressive rollout:

| Flag | Default | Description |
|------|---------|-------------|
| `FEATURE_COMPARISON` | true | Enable property comparison |
| `FEATURE_RECOMMENDATIONS` | true | Enable recommendation engine |
| `FEATURE_INVESTMENT_SCORE` | true | Enable investment analysis |
| `FEATURE_ADMIN_DASHBOARD` | true | Enable admin dashboard |
| `FEATURE_SOCIAL_LOGIN` | false | Enable Google OAuth2 |
| `FEATURE_MAP_SEARCH` | false | Enable map-based property search |
| `FEATURE_NOTIFICATIONS` | false | Enable notification system |

### Implementation

```python
# datasage/core/config.py
class Settings(BaseSettings):
    FEATURE_COMPARISON: bool = True
    FEATURE_RECOMMENDATIONS: bool = True
    FEATURE_INVESTMENT_SCORE: bool = True
    FEATURE_SOCIAL_LOGIN: bool = False
    FEATURE_MAP_SEARCH: bool = False
    FEATURE_NOTIFICATIONS: bool = False

# Usage in router
@router.get("/recommendations")
async def get_recommendations(user = Depends(get_current_user)):
    if not settings.FEATURE_RECOMMENDATIONS:
        raise HTTPException(404, "This feature is not available")
    ...
```

### Frontend Feature Flags

Exposed via a lightweight API endpoint:

```
GET /api/v1/config/features

{
  "comparison": true,
  "recommendations": true,
  "investment_score": true,
  "social_login": false,
  "map_search": false,
  "notifications": false
}
```

---

## Secrets Management

### Development
- `.env` file (gitignored)
- Secrets are human-readable for convenience

### Staging / Production
- Cloud provider secrets manager (AWS Secrets Manager, GCP Secret Manager)
- Injected as environment variables at container startup
- Never stored in image or source code

---

## Related Documents

- [08 — Backend Architecture](08-backend-architecture.md)
- [24 — Deployment](24-deployment.md)
- [19 — Security](19-security.md)
