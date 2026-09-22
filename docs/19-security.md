# 19 — Security

## Overview

This document covers security measures across the DataSage stack, organized by OWASP Top 10 categories, with concrete implementation details.

---

## OWASP Top 10 Mitigations

### A01: Broken Access Control

| Threat | Mitigation |
|--------|-----------|
| Unauthorized admin access | RBAC with `require_role("admin")` dependency on all admin endpoints |
| IDOR (accessing another user's data) | All user-specific queries filter by `user_id` from JWT, never from URL path |
| Missing function-level checks | Every router function has explicit auth dependency |
| Privilege escalation | Role changes require admin role. Users cannot self-assign roles. |

### A02: Cryptographic Failures

| Threat | Mitigation |
|--------|-----------|
| Password exposure | bcrypt hashing (cost=12). Plaintext never stored or logged. |
| Token forgery | JWT signed with HS256 + 64-char secret. RS256 for multi-service (future). |
| Data in transit | HTTPS enforced via Nginx TLS termination in production. HSTS headers. |
| Secret exposure | Secrets in environment variables. `.env` gitignored. |

### A03: Injection

| Threat | Mitigation |
|--------|-----------|
| SQL injection | SQLAlchemy ORM with parameterized queries. No raw SQL with user input. |
| NoSQL injection | N/A (PostgreSQL only) |
| OS command injection | No shell commands executed from user input. |
| Template injection | Next.js React — automatic JSX escaping. No `dangerouslySetInnerHTML` with user content. |

### A04: Insecure Design

| Threat | Mitigation |
|--------|-----------|
| No rate limiting | Redis-backed rate limiter on all endpoints. Stricter on auth endpoints. |
| No account lockout | Account locked after 5 failed login attempts. |
| Weak password policy | ≥8 chars, ≥1 uppercase, ≥1 digit, common password blacklist. |
| No CSRF protection | JWT Bearer token auth is inherently CSRF-resistant (not sent automatically by browsers). |

### A05: Security Misconfiguration

| Threat | Mitigation |
|--------|-----------|
| Debug mode in production | `APP_DEBUG=false` in production. Swagger UI disabled. |
| Default credentials | No default admin password. First admin created via CLI with prompted password. |
| Verbose error messages | Production errors return generic messages. Stack traces only in logs. |
| Open CORS | CORS restricted to frontend origin in production. |
| Unnecessary headers | Nginx strips `Server` and `X-Powered-By` headers. |

### A06: Vulnerable and Outdated Components

| Threat | Mitigation |
|--------|-----------|
| Known CVEs in dependencies | Weekly automated dependency scanning (pip-audit, npm audit). |
| Outdated base images | Docker images pinned to specific versions. Monthly rebuild schedule. |
| Unused dependencies | Periodic `pip-audit` and `npm audit` reviews. |

### A07: Identification and Authentication Failures

Covered in [11 — Authentication & Authorization](11-authentication-authorization.md).

### A08: Software and Data Integrity Failures

| Threat | Mitigation |
|--------|-----------|
| Tampered dependencies | Lock files (`requirements.txt` with pinned versions, `package-lock.json`). |
| ML model tampering | Model files are checksummed. Hash verified on load. |
| Dataset integrity | Dataset imports are immutable. Admin actions logged. |

### A09: Security Logging and Monitoring Failures

Covered in [22 — Observability](22-observability.md).

### A10: Server-Side Request Forgery (SSRF)

| Threat | Mitigation |
|--------|-----------|
| SSRF via Overpass queries | Overpass URL is hardcoded in config, not user-supplied. |
| SSRF via image URLs | Property images are served from our storage, not proxied from user URLs. |

---

## Input Validation

All API inputs are validated by Pydantic models before reaching business logic:

```python
# Example: Property search params
class PropertySearchParams(BaseModel):
    locality_id: Optional[int] = Field(None, ge=1)
    bhk: Optional[int] = Field(None, ge=1, le=10)
    min_price: Optional[int] = Field(None, ge=0)
    max_price: Optional[int] = Field(None, ge=0)
    property_type: Optional[PropertyType] = None
    sort: Optional[SortField] = SortField.RELEVANCE
    order: Optional[SortOrder] = SortOrder.DESC
    limit: int = Field(20, ge=1, le=100)
    cursor: Optional[str] = None

    @validator("max_price")
    def max_gte_min(cls, v, values):
        if v and values.get("min_price") and v < values["min_price"]:
            raise ValueError("max_price must be ≥ min_price")
        return v
```

---

## Secrets Management

| Secret | Storage | Rotation |
|--------|---------|----------|
| JWT_SECRET_KEY | Environment variable | On suspected compromise |
| POSTGRES_PASSWORD | Environment variable | Quarterly |
| REDIS_PASSWORD | Environment variable | Quarterly |
| APP_SECRET_KEY | Environment variable | Quarterly |

### Rules
- Secrets are NEVER committed to version control.
- `.env` is gitignored. `.env.example` has placeholder values.
- Production secrets managed via cloud provider secrets manager (AWS Secrets Manager / GCP Secret Manager).
- All secrets are ≥32 characters, randomly generated.

---

## HTTP Security Headers (Nginx)

```nginx
# Production nginx.conf
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "0" always;  # Deprecated; rely on CSP
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://tile.openstreetmap.org; connect-src 'self' https://overpass-api.de" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self)" always;
```

---

## Dependency Scanning

| Tool | Frequency | What |
|------|-----------|------|
| `pip-audit` | Weekly (CI) + pre-release | Python dependency CVEs |
| `npm audit` | Weekly (CI) + pre-release | Node.js dependency CVEs |
| Docker Scout | Monthly | Container image CVEs |
| Dependabot / Renovate | Continuous | Automated dependency update PRs |

---

## Related Documents

- [11 — Auth & Authorization](11-authentication-authorization.md)
- [20 — Privacy](20-privacy.md)
- [21 — Error Handling](21-error-handling.md)
- [22 — Observability](22-observability.md)
