# 05 — Non-Functional Requirements

## Overview

This document defines measurable performance, scalability, reliability, and quality targets for DataSage. Each requirement specifies a target, measurement method, and rationale.

---

## NFR-1: Performance

### API Response Time

| Endpoint Category | Target (p95) | Target (p99) | Rationale |
|-------------------|-------------|-------------|-----------|
| Static pages / health check | < 50ms | < 100ms | Trivial endpoints; no DB queries |
| Property search (list) | < 300ms | < 500ms | User-facing search must feel instant |
| Property detail | < 400ms | < 700ms | Includes DB joins + cached ML prediction |
| ML valuation (single, cached) | < 100ms | < 200ms | Redis cache hit |
| ML valuation (single, uncached) | < 2,000ms | < 3,000ms | Model inference + feature computation |
| ML valuation (batch, 100) | < 10,000ms | < 15,000ms | Admin-only; background-acceptable |
| Geospatial POI query (cached) | < 200ms | < 400ms | PostGIS spatial query on indexed data |
| Geospatial POI query (OSM live) | < 5,000ms | < 10,000ms | External API; rate-limited |
| Recommendation generation | < 1,500ms | < 3,000ms | Scoring across candidate set |
| Authentication (login/register) | < 300ms | < 500ms | bcrypt hashing is CPU-bound |

### Frontend Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| JavaScript bundle size (gzipped) | < 200 KB initial | Next.js build analysis |
| Image optimization | WebP/AVIF, lazy-loaded, responsive `srcset` | Manual audit |

### Database Performance

| Metric | Target | Rationale |
|--------|--------|-----------|
| Query execution (indexed) | < 10ms for simple lookups | B-tree and GiST indexes on key columns |
| Spatial query (ST_DWithin) | < 50ms for 5 km radius | GiST index on geography columns |
| Connection pool utilization | < 70% under normal load | Pool size: 10 connections, max overflow: 20 |
| Migration execution | < 30s for schema changes | Alembic online migrations |

---

## NFR-2: Scalability

### Capacity Targets (MVP)

| Metric | MVP Target | Measurement |
|--------|-----------|-------------|
| Concurrent users | 100 | Load test with k6/Locust |
| Properties in dataset | 50,000 | Seed data + growth |
| Registered users | 10,000 | User table count |
| API requests/minute | 1,000 | Backend metrics |
| ML predictions/day | 5,000 | Prediction log count |

### Scaling Strategy

**Vertical scaling** is the MVP strategy. The architecture is designed so that horizontal scaling can be added later without rewrites:

| Component | MVP | Horizontal Scale Path |
|-----------|-----|----------------------|
| FastAPI backend | Single process, multi-worker (uvicorn) | Add replicas behind load balancer |
| PostgreSQL | Single instance | Read replicas, or Citus for sharding |
| Redis | Single instance | Redis Cluster or Sentinel |
| ML inference | In-process (loaded model) | Separate ML service + message queue |
| Frontend | Single Next.js instance | Vercel / CDN + multiple instances |

### Multi-City Scaling

Adding a new city requires:
1. Data ingestion: city-scoped datasets
2. Model: city-specific model weights or fine-tuned model
3. Config: city geofence, locality list, scoring weights
4. No schema changes, no code changes

Data partitioning strategy: `city_id` column on `Property`, `Locality`, and related tables. Queries always scoped by city. Future: table partitioning by `city_id` if data volume warrants it.

---

## NFR-3: Availability & Reliability

| Metric | Target | Rationale |
|--------|--------|-----------|
| Uptime (monthly) | 99.5% | ~3.6 hours downtime/month acceptable for MVP |
| Recovery Time Objective (RTO) | < 1 hour | Docker restart + DB recovery |
| Recovery Point Objective (RPO) | < 1 hour | Hourly DB backups |
| Graceful degradation | Required | If ML service fails, show property data without AI analysis. If OSM is unreachable, show cached POI data. |
| Zero-downtime deployments | Future | Blue-green or rolling deployment |

### Failure Modes and Graceful Degradation

| Failure | Impact | Degradation |
|---------|--------|-------------|
| ML model fails to load | No valuations | Show properties without pricing analysis. Banner: "AI analysis temporarily unavailable." |
| Redis unavailable | No cache, slower responses | Fall through to DB/model. Responses slower but functional. |
| Overpass API rate-limited | No fresh POI data | Serve cached POI data (may be up to 30 days old). Show staleness indicator. |
| PostgreSQL connection pool exhausted | API errors | Queue requests with circuit breaker. Return 503 with retry header. |
| Frontend build fails | App unavailable | Rollback to last successful build. |

---

## NFR-4: Security

Detailed in [19 — Security](19-security.md). Summary targets:

| Requirement | Target |
|------------|--------|
| OWASP Top 10 | All mitigated |
| Password storage | bcrypt, cost=12 |
| API authentication | JWT with RS256 or HS256 |
| Input validation | All user inputs validated server-side (Pydantic) |
| Rate limiting | Per-endpoint, per-user |
| HTTPS | Required in production |
| Dependency scanning | Weekly automated scan (Dependabot/Snyk) |

---

## NFR-5: Data Freshness

| Data Type | Freshness Target | Update Mechanism |
|-----------|-----------------|------------------|
| Property listings | Dataset-dependent (manual upload) | Admin uploads new dataset |
| OSM POI data | ≤ 30 days | Scheduled Overpass re-query per area |
| ML predictions | ≤ 24 hours after data change | Cache invalidation on property update |
| Circle rates | Annual (when government publishes) | Manual ingestion |
| Location scores | Recomputed on POI refresh | Triggered by POI update job |

---

## NFR-6: Browser & Device Support

| Browser | Minimum Version | Test Frequency |
|---------|----------------|----------------|
| Chrome | 90+ | Every release |
| Firefox | 90+ | Every release |
| Safari | 15+ | Every release |
| Edge | 90+ | Every release |
| Mobile Chrome (Android) | 90+ | Every release |
| Mobile Safari (iOS) | 15+ | Every release |

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | 320px – 767px | Single column, bottom nav, vertical comparison |
| Tablet | 768px – 1023px | Two columns, sidebar nav |
| Desktop | 1024px – 1439px | Full layout, side-by-side comparison |
| Large Desktop | 1440px+ | Full layout with expanded panels |

---

## NFR-7: Accessibility

| Requirement | Standard | Target |
|------------|----------|--------|
| WCAG compliance | WCAG 2.1 | Level AA |
| Keyboard navigation | All interactive elements | Full keyboard support |
| Screen reader support | ARIA labels, roles, live regions | Tested with NVDA/VoiceOver |
| Color contrast | Text/background | Minimum 4.5:1 ratio |
| Focus indicators | Interactive elements | Visible focus ring |

---

## NFR-8: Internationalization (i18n)

| Aspect | MVP | Future |
|--------|-----|--------|
| Language | English only | Hindi, regional languages |
| Currency | INR only | INR (no change planned) |
| Number formatting | Indian numbering system (lakhs, crores) | Same |
| Date format | DD/MM/YYYY | Locale-aware |
| String externalization | All user-facing strings in translation files | Required from day one |
| RTL support | Not required | Not planned |

### Indian Numbering System

All currency values displayed using Indian formatting:
- ₹ symbol prefix
- Lakhs and crores grouping: ₹1,25,00,000 (not ₹12,500,000)
- Abbreviations: ₹1.25 Cr, ₹45 L
- Raw values stored as integers (paisa precision not needed for real estate)

---

## NFR-9: Observability

Detailed in [22 — Observability](22-observability.md). Summary:

| Requirement | Target |
|------------|--------|
| Structured logging | JSON format, request_id correlation |
| Application metrics | Prometheus-compatible endpoints |
| Error tracking | Sentry integration (production) |
| Health checks | `/health` endpoint with dependency status |
| Log retention | 30 days in development, 90 days in production |

---

## NFR-10: Data Volume Estimates

| Entity | Year 1 Estimate | Storage Estimate |
|--------|----------------|-----------------|
| Properties | 50,000 | ~500 MB (with features, locations) |
| Users | 10,000 | ~50 MB |
| Valuation predictions | 200,000 | ~100 MB |
| POI cache | ~500,000 POIs | ~200 MB |
| Search history | 500,000 entries | ~100 MB |
| Saved properties | 100,000 entries | ~20 MB |
| Audit logs | 50,000 entries | ~50 MB |
| **Total** | — | **~1 GB** |

PostgreSQL storage with indexes: ~2 GB estimated. Well within single-instance capacity.

---

## Related Documents

- [06 — System Architecture](06-system-architecture.md)
- [19 — Security](19-security.md)
- [22 — Observability](22-observability.md)
- [24 — Deployment](24-deployment.md)
