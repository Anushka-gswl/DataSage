# 21 — Error Handling

## Overview

DataSage uses a structured error taxonomy with consistent error codes, HTTP status mapping, user-facing messages, and graceful degradation strategies.

---

## Error Response Format

All API errors return this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "request_id": "req_abc123",
    "details": {}
  }
}
```

---

## Error Taxonomy

| Category | HTTP Status | Code Prefix | Example |
|----------|-----------|-------------|---------|
| Client input errors | 400, 422 | `VALIDATION_*`, `BAD_REQUEST` | Missing field, invalid format |
| Authentication | 401 | `AUTH_*` | Invalid token, expired token |
| Authorization | 403 | `FORBIDDEN` | Insufficient role |
| Resource not found | 404 | `NOT_FOUND` | Property doesn't exist |
| Conflict | 409 | `CONFLICT` | Duplicate email |
| Rate limiting | 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| Server errors | 500 | `INTERNAL_ERROR` | Unexpected exception |
| Service unavailable | 503 | `SERVICE_*` | ML model not loaded, DB unreachable |

### Complete Error Code Table

| Code | HTTP | Message Template | When |
|------|------|-----------------|------|
| `VALIDATION_ERROR` | 422 | "{field}: {rule}" | Pydantic validation failure |
| `BAD_REQUEST` | 400 | "Malformed request" | Unparseable JSON |
| `AUTH_INVALID_CREDENTIALS` | 401 | "Invalid email or password" | Login failure |
| `AUTH_TOKEN_EXPIRED` | 401 | "Token has expired" | JWT expired |
| `AUTH_TOKEN_INVALID` | 401 | "Invalid token" | JWT signature mismatch |
| `AUTH_ACCOUNT_LOCKED` | 423 | "Account locked. Try again in {minutes} minutes" | Too many failed logins |
| `FORBIDDEN` | 403 | "Insufficient permissions" | Wrong role |
| `NOT_FOUND` | 404 | "{resource} not found" | Resource doesn't exist |
| `CONFLICT_EMAIL` | 409 | "An account with this email already exists" | Duplicate registration |
| `RATE_LIMIT_EXCEEDED` | 429 | "Too many requests. Try again in {seconds}s" | Rate limit hit |
| `INSUFFICIENT_DATA` | 422 | "Cannot generate valuation. Missing: {fields}" | ML prediction missing features |
| `MODEL_NOT_LOADED` | 503 | "AI analysis temporarily unavailable" | ML model failed to load |
| `SERVICE_UNAVAILABLE` | 503 | "Service temporarily unavailable" | DB/Redis unreachable |
| `INTERNAL_ERROR` | 500 | "An unexpected error occurred" | Unhandled exception |

---

## Graceful Degradation

| Failure | Degradation Strategy | User Impact |
|---------|---------------------|-------------|
| ML model unavailable | Show property details without pricing analysis | Banner: "AI analysis temporarily unavailable" |
| Redis unavailable | Bypass cache, query DB directly | Slower responses, no rate limiting |
| Overpass API down | Serve cached POI data | Stale POI data (up to 30 days old). Badge: "Location data may not be current" |
| Database overloaded | Circuit breaker (503 with retry-after) | "We're experiencing heavy load. Please try again shortly." |
| Image CDN down | Show placeholder image | Placeholder with property title |

---

## Retry Strategy

### Client-Side (Frontend)

```typescript
// SWR handles retries automatically
const { data, error } = useSWR('/api/v1/properties', fetcher, {
  errorRetryCount: 3,
  errorRetryInterval: 2000,  // 2 seconds
  shouldRetryOnError: (error) => error.status >= 500,  // Only retry server errors
});
```

### Server-Side (External API Calls)

```python
# Overpass API client
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=2, min=2, max=30),
    retry=retry_if_exception_type((httpx.TimeoutException, httpx.HTTPStatusError)),
)
async def query_overpass(self, query: str) -> dict:
    response = await self.client.post(self.url, data={"data": query})
    response.raise_for_status()
    return response.json()
```

---

## Circuit Breaker (Database)

When the database connection pool is exhausted:

```python
# Simple circuit breaker for DB operations
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30):
        self.failures = 0
        self.threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half-open

    async def call(self, func, *args, **kwargs):
        if self.state == "open":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "half-open"
            else:
                raise ServiceUnavailableError("Database circuit breaker open")

        try:
            result = await func(*args, **kwargs)
            self.failures = 0
            self.state = "closed"
            return result
        except Exception:
            self.failures += 1
            self.last_failure_time = time.time()
            if self.failures >= self.threshold:
                self.state = "open"
            raise
```

---

## Frontend Error Display

| Error Type | Component | UX |
|-----------|-----------|-----|
| Field validation | Inline under field | Red text: "Password must be at least 8 characters" |
| Form submission error | Toast notification | Red toast: "Registration failed: email already exists" |
| Page-level error | Full-page error | Illustration + message + retry button |
| Section-level error | Section placeholder | "AI analysis unavailable" banner with retry |
| Network error | Toast notification | "You appear to be offline" |
| Rate limit | Toast notification | "Too many requests. Please wait." |

---

## Related Documents

- [08 — Backend Architecture](08-backend-architecture.md)
- [10 — API Specification](10-api-specification.md)
- [22 — Observability](22-observability.md)
