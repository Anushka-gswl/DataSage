# 27 — Development Roadmap

## Overview

DataSage is developed in 5 phases, each delivering a usable increment. Phase 1 and 2 constitute the MVP.

---

## Phase Overview

```mermaid
gantt
    title DataSage Development Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Phase 1 - Foundation
    Project setup & DB              :p1a, 2026-10-01, 2w
    Auth & User management          :p1b, after p1a, 2w
    Property CRUD & search          :p1c, after p1b, 2w
    Seed data & ingestion           :p1d, after p1b, 2w

    section Phase 2 - Intelligence
    ML training pipeline            :p2a, after p1c, 3w
    Geospatial system (OSM)         :p2b, after p1c, 2w
    Valuation & pricing             :p2c, after p2a, 2w
    Explainable AI                  :p2d, after p2c, 1w

    section Phase 3 - Personalization
    User onboarding                 :p3a, after p2d, 1w
    Recommendation engine           :p3b, after p3a, 2w
    Property comparison             :p3c, after p2d, 1w
    Investment analysis             :p3d, after p2d, 2w

    section Phase 4 - Polish
    Admin dashboard                 :p4a, after p3b, 2w
    Frontend polish & responsive    :p4b, after p3b, 2w
    Testing & quality               :p4c, after p4a, 2w

    section Phase 5 - Production
    Deployment pipeline             :p5a, after p4c, 1w
    Performance optimization        :p5b, after p5a, 1w
    Documentation finalization      :p5c, after p5b, 1w
```

---

## Phase 1: Foundation (Weeks 1–8)

**Goal**: Functional backend with auth, property data, and basic search.

| Week | Milestone | Deliverables |
|------|-----------|-------------|
| 1–2 | Project setup | Docker Compose, PostgreSQL+PostGIS, FastAPI scaffold, Next.js scaffold, Alembic migrations |
| 3–4 | Authentication | Registration, login, JWT tokens, password reset, RBAC, user profile |
| 5–6 | Property data | Property model, CRUD API, seed data generator, CSV import |
| 7–8 | Search | Locality autocomplete, property search with filters, pagination, result cards |

**Exit criteria**: A user can register, log in, search for properties, and view property details.

---

## Phase 2: Intelligence (Weeks 9–15)

**Goal**: ML valuation, geospatial analysis, and explainable AI.

| Week | Milestone | Deliverables |
|------|-----------|-------------|
| 9–11 | ML pipeline | Feature engineering, XGBoost training, evaluation, model serialization |
| 9–10 | Geospatial | Overpass API integration, POI caching, location scoring |
| 12–13 | Valuation | Prediction API, confidence intervals, pricing classification |
| 14 | Explainability | SHAP integration, explanation templates, natural language generation |
| 15 | Integration | Property detail page with full AI analysis section |

**Exit criteria**: Property detail pages show predicted fair value, pricing classification, location score, nearby amenities on a map, and AI explanations.

---

## Phase 3: Personalization (Weeks 16–20)

**Goal**: User preferences, recommendations, comparison, and investment analysis.

| Week | Milestone | Deliverables |
|------|-----------|-------------|
| 16 | Onboarding | Multi-step preference wizard, preference API |
| 17–18 | Recommendations | Scoring engine, candidate filtering, explanation generation |
| 16 | Comparison | Comparison list, side-by-side table, best-pick logic |
| 17–18 | Investment | Investment scoring, locality trends, rental yield estimates |
| 19–20 | Dashboard | User dashboard with recommendations, saved properties, search history |

**Exit criteria**: Users can set preferences, receive personalized recommendations with explanations, compare properties, and view investment analysis.

---

## Phase 4: Polish (Weeks 21–24)

**Goal**: Admin features, UI polish, and comprehensive testing.

| Week | Milestone | Deliverables |
|------|-----------|-------------|
| 21–22 | Admin dashboard | System health, dataset management, model management, user management, audit logs |
| 21–22 | UI polish | Responsive design, loading states, error states, empty states, animations |
| 23–24 | Testing | Unit tests (>80% coverage), integration tests, E2E tests, accessibility audit |

**Exit criteria**: Admin can manage datasets and models. All user flows work on mobile. Test coverage >80%.

---

## Phase 5: Production (Weeks 25–27)

**Goal**: Production-ready deployment and optimization.

| Week | Milestone | Deliverables |
|------|-----------|-------------|
| 25 | Deployment | CI/CD pipeline, Docker builds, staging environment, production checklist |
| 26 | Performance | API latency optimization, frontend bundle optimization, caching tuning |
| 27 | Finalization | Documentation review, CHANGELOG update, launch preparation |

**Exit criteria**: System deployed to production, all performance targets met, documentation complete.

---

## Module Dependency Graph

```mermaid
graph TD
    DB[Database + Migrations] --> AUTH[Authentication]
    DB --> PROP[Property CRUD]
    AUTH --> PREF[User Preferences]
    PROP --> SEARCH[Property Search]
    PROP --> GEO[Geospatial System]
    PROP --> ML[ML Training Pipeline]
    ML --> VAL[Valuation Service]
    GEO --> LOC[Location Scoring]
    VAL --> XAI[Explainable AI]
    VAL --> PRICE[Pricing Classification]
    PREF --> REC[Recommendation Engine]
    LOC --> REC
    VAL --> REC
    PROP --> CMP[Property Comparison]
    VAL --> CMP
    LOC --> CMP
    LOC --> INV[Investment Analysis]
    VAL --> INV
    AUTH --> ADMIN[Admin Dashboard]
    PROP --> ADMIN
    ML --> ADMIN
```

---

## Related Documents

- [28 — MVP vs Future Scope](28-mvp-vs-future-scope.md)
- [04 — Functional Requirements](04-functional-requirements.md)
- [30 — Acceptance Criteria](30-acceptance-criteria.md)
