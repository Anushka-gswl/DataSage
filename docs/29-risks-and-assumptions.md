# 29 — Risks & Assumptions

## Risk Register

| ID | Risk | Probability | Impact | Severity | Mitigation | Owner |
|----|------|:-----------:|:------:|:--------:|-----------|-------|
| R1 | **Insufficient training data**: Limited publicly available property data for Delhi-NCR results in poor model accuracy | High | High | Critical | Start with circle rates + synthetic data. Design ingestion pipeline to accept better data sources when available. Set conservative accuracy expectations. | ML Engineer |
| R2 | **No commercial API access**: Cannot access MagicBricks/99acres/Housing.com data, limiting dataset quality and size | High | High | Critical | Architecture is data-source agnostic. If API access becomes available, add an adapter. Do not promise features dependent on commercial data. | Product |
| R3 | **OpenStreetMap data gaps**: OSM coverage for some Delhi-NCR localities may be incomplete, leading to inaccurate location scores | Medium | Medium | High | Validate OSM coverage during development. Flag areas with sparse data in the UI. Allow admin to supplement POI data manually. | Backend |
| R4 | **Model bias by locality**: Valuation model may perform well in data-rich localities (Gurgaon, South Delhi) but poorly in data-sparse localities | Medium | High | High | Monitor per-locality MAPE. Display confidence scores prominently. Suppress predictions where confidence is below threshold. | ML Engineer |
| R5 | **Overpass API rate limits**: Heavy usage during development or batch operations may trigger rate limiting from the public Overpass API | Medium | Medium | Medium | Self-impose rate limits (2 req/s). Cache aggressively (30-day TTL). Future: self-hosted Overpass instance. | Backend |
| R6 | **Concept drift**: Delhi-NCR property market changes (metro expansion, policy changes, market cycles) degrade model accuracy | Medium | Medium | Medium | Monthly retraining schedule. Data drift monitoring (PSI). Admin can trigger manual retraining. | ML Engineer |
| R7 | **User adoption**: Users may not trust AI-generated valuations, especially if early predictions are inaccurate | Medium | High | High | Explainable AI shows reasoning. Confidence intervals communicate uncertainty. "Beta" label during early launch. User feedback mechanism. | Product |
| R8 | **Security breach**: JWT secret or database credentials exposed | Low | Very High | High | Secrets in environment variables, not code. Regular rotation. Security scanning. HTTPS enforced. | DevOps |
| R9 | **Scope creep**: Expanding beyond Delhi-NCR or adding commercial features before MVP is stable | Medium | Medium | Medium | Strict MVP boundary (this document). Feature flags gate unreleased features. | Product |
| R10 | **Performance degradation under load**: Unoptimized queries or ML inference cause slow responses | Medium | Medium | Medium | Performance targets defined (NFR). Load testing before launch. Caching strategy. | Backend |
| R11 | **Data quality issues in user-uploaded datasets**: Admin uploads contain errors, duplicates, or outdated data | High | Medium | High | Data quality validation pipeline with quarantine. Quality reports before dataset activation. | Data |
| R12 | **Dependency vulnerabilities**: Third-party Python/Node packages with security CVEs | Medium | Medium | Medium | Weekly automated dependency scanning. Pinned versions. Alerts on critical CVEs. | DevOps |

---

## Assumptions

| ID | Assumption | Category | Risk Level | What If Wrong? |
|----|-----------|----------|:----------:|---------------|
| A1 | Property data will be sourced from publicly available government records and synthetic seed data. | Data | High | ML model accuracy is speculative. Clearly communicate this to users. |
| A2 | OpenStreetMap data for Delhi-NCR is sufficiently complete for POI analysis (schools, hospitals, metro). | Data | Medium | Flag low-coverage areas. Allow manual POI additions. |
| A3 | The ML model (XGBoost) will achieve MAPE < 15% on representative data. | ML | High | If > 15%, display predictions with wider confidence intervals and lower confidence badges. Consider model improvements. |
| A4 | BHK is the standard size classification for Indian residential properties. | Domain | Low | No impact — BHK is universally used. |
| A5 | Users will provide preference data during onboarding for recommendations to work. | Product | Medium | Cold-start handling uses popularity-based fallback. Progressive profiling prompts. |
| A6 | Pricing classification thresholds (±10%) are appropriate for Delhi-NCR. | Domain | Medium | Make thresholds configurable per city. Validate with domain experts. |
| A7 | Property prices in datasets are in INR. | Data | Low | Currency validation during ingestion. |
| A8 | Users are primarily English-speaking. | Product | Medium | String externalization from day one. Hindi as first translation target. |
| A9 | The MVP will serve < 100 concurrent users. | Infrastructure | Low | If growth exceeds this, vertical scaling handles up to ~500. Horizontal scaling path documented. |
| A10 | Delhi-NCR locality names are reasonably standardized (e.g., "Sector 75" not "Sec-75" or "S-75"). | Data | Medium | Locality normalization during ingestion (fuzzy matching, alias table). |
| A11 | Property images will be handled via URL references, not uploaded binary files (MVP). | Data | Low | Simplifies storage. Add image upload in future phase. |
| A12 | The Overpass API will remain free and publicly accessible. | External | Low | If it changes, self-host an Overpass instance using publicly available OSM data dumps. |

---

## Dependency Risks

| Dependency | Risk | Mitigation |
|-----------|------|-----------|
| PostgreSQL 16 + PostGIS 3.4 | Version EOL or incompatibility | Pinned versions. LTS support for PostgreSQL. |
| FastAPI / Pydantic | Breaking changes in major versions | Pinned versions. Test before upgrading. |
| Next.js 14 | App Router API changes | Pinned version. Upgrade only with test coverage. |
| XGBoost / scikit-learn | Model format changes between versions | Pin versions. Model metadata includes library versions. |
| SHAP library | Compatibility with XGBoost versions | Pin compatible versions. Test SHAP on model load. |
| Overpass API | Rate limits, downtime, API changes | Caching, rate limiting, self-hosted fallback path. |
| Leaflet | Plugin compatibility | Pin versions. Minimal plugin use. |

---

## Related Documents

- [00 — Project Overview](00-project-overview.md)
- [01 — Product Requirements](01-product-requirements.md)
- [12 — ML System Design](12-ml-system-design.md)
- [28 — MVP vs Future Scope](28-mvp-vs-future-scope.md)
