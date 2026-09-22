# 28 — MVP vs Future Scope

## Overview

This document explicitly defines the boundary between MVP (Minimum Viable Product) and future enhancements. The MVP delivers a complete, usable product for Delhi-NCR with core AI capabilities. Future scope extends to additional cities, advanced features, and scale.

---

## MVP Scope (Phases 1–5)

### MVP Modules (In Scope)

| Module | Status | Core Capabilities |
|--------|--------|-------------------|
| Authentication & User Management | ✅ MVP | Email/password registration, JWT auth, RBAC (4 roles) |
| User Onboarding | ✅ MVP | Preference wizard: budget, BHK, localities, commute, lifestyle |
| Property Search | ✅ MVP | Locality search, filters (price, BHK, area, type), pagination |
| Property Details | ✅ MVP | Full property page with all available attributes |
| Property Valuation | ✅ MVP | XGBoost regression, confidence intervals |
| Over/Underpricing Detection | ✅ MVP | Price-gap classification (±10% thresholds) |
| Geospatial Intelligence | ✅ MVP | OSM POIs, location score, map visualization |
| Recommendation Engine | ✅ MVP | Content-based filtering, suitability scoring |
| Property Comparison | ✅ MVP | Side-by-side (2–4 properties), best-pick |
| Investment Analysis | ✅ MVP | Investment score from locality trends, infrastructure, yield |
| Explainable AI | ✅ MVP | SHAP explanations, natural-language insights |
| Saved Properties | ✅ MVP | Save/unsave toggle, saved list |
| Search History | ✅ MVP | Record + view + clear search history |
| Admin Dashboard | ✅ MVP | System health, datasets, models, users, audit |

### MVP Constraints

| Constraint | Detail |
|-----------|--------|
| Geography | Delhi-NCR only (6 cities) |
| Property types | Apartments and builder floors primarily. Houses and plots supported but may have lower model accuracy. |
| Data source | Synthetic seed data + publicly available government data |
| ML model | Single XGBoost model. No ensemble. No deep learning. |
| Map | Leaflet with OSM tiles. No advanced routing or traffic data. |
| Notifications | None in MVP |
| Social login | None in MVP |
| Mobile app | No native app. Responsive web only. |
| Multi-language | English only |

---

## Future Scope

### Phase 6: Multi-City Expansion

| Feature | Description | Prerequisite |
|---------|-------------|-------------|
| Add Bangalore | Ingest Bangalore property data, train city-specific model | Data source for Bangalore |
| Add Mumbai | Same as above | Data source for Mumbai |
| Add Pune, Hyderabad, Chennai | Phased city additions | Data + model training |
| City selector | Global city dropdown, city-scoped search and recommendations | Multi-city architecture (already designed) |

**Architecture readiness**: The `city_id` column on all data tables, city-scoped configurations, and model versioning per city mean that adding a city requires:
1. Data ingestion for the new city
2. City-specific model training
3. Configuration entry (geofence, locality list, scoring weights)

No schema changes or code modifications needed.

### Phase 7: Advanced Features

| Feature | Description | Value |
|---------|-------------|-------|
| Map-based search | Drag/zoom to search within map viewport | Visual discovery |
| Isochrone analysis | Walk/drive time contours from property | Commute visualization |
| Social login (Google) | OAuth2 integration | Faster onboarding |
| Saved search alerts | Notify when new properties match saved filters | Engagement |
| Price change alerts | Notify when saved property price changes | Re-engagement |
| Property reports | Downloadable PDF analysis report | Professional use |
| Interactive SHAP chart | Waterfall chart for feature contributions | Advanced users |
| Dark mode | Theme toggle | UX preference |

### Phase 8: Platform Scale

| Feature | Description | When |
|---------|-------------|------|
| Collaborative filtering | "Users like you also liked" recommendations | >10K active users |
| Real-time pricing data | Integration with commercial listing APIs (if available) | API partnership |
| Property portfolio management | Track multiple owned/invested properties | Professional tier |
| API access for partners | External API with rate limiting and billing | Revenue feature |
| Native mobile app | React Native or Flutter | User demand signal |
| Multi-language (Hindi) | i18n with Hindi translations | Market demand |

---

## Feature Prioritization Matrix

| Feature | User Impact | Effort | Data Dependency | Priority |
|---------|-----------|--------|----------------|----------|
| Multi-city | High | Medium | High (need city data) | P1 |
| Map-based search | Medium | Medium | Low | P1 |
| Social login | Medium | Low | Low | P1 |
| Notifications | Medium | Medium | Low | P2 |
| Isochrone analysis | Medium | High | Low | P2 |
| PDF reports | Medium | Medium | Low | P2 |
| Interactive SHAP | Low | Medium | Low | P3 |
| Collaborative filtering | Medium | High | High (need user base) | P3 |
| Native mobile app | Medium | Very High | Low | P4 |

---

## Related Documents

- [00 — Project Overview](00-project-overview.md)
- [01 — Product Requirements](01-product-requirements.md)
- [27 — Development Roadmap](27-development-roadmap.md)
- [29 — Risks & Assumptions](29-risks-and-assumptions.md)
