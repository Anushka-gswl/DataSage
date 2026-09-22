# 23 — Testing Strategy

## Overview

DataSage follows the test pyramid with unit tests as the foundation, integration tests for API and database interactions, and end-to-end tests for critical user flows.

---

## Test Pyramid

```
         ┌──────┐
         │ E2E  │  ~10 tests (critical flows)
        ┌┴──────┴┐
        │ Integ. │  ~50 tests (API + DB)
       ┌┴────────┴┐
       │  Unit    │  ~200 tests (services, utils, ML)
       └──────────┘
```

---

## Backend Testing

### Unit Tests

| Module | What to Test | Tool |
|--------|-------------|------|
| Services | Business logic (valuation, scoring, recommendations) | pytest |
| Feature engineering | Feature vector construction, missing value handling | pytest |
| Geo scoring | Location score computation from known POI data | pytest |
| Recommendation scoring | Suitability score formula, cold-start handling | pytest |
| Explainability | SHAP value → text explanation mapping, template coverage | pytest |
| Validators | Pydantic schema validation edge cases | pytest |
| Utilities | INR formatting, date parsing, coordinate validation | pytest |

### Integration Tests

| Target | What to Test | Tool |
|--------|-------------|------|
| API endpoints | Request → response, status codes, pagination, error format | pytest + httpx (TestClient) |
| Database | ORM queries, spatial queries, migrations | pytest + test DB (PostgreSQL) |
| Auth flow | Register → login → token refresh → protected endpoint | pytest + TestClient |
| Data ingestion | CSV upload → validation → insert → quality report | pytest + test DB |
| Redis caching | Cache set/get/invalidate | pytest + test Redis |

### Test Database Setup

```python
# tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

@pytest.fixture
async def test_db():
    engine = create_async_engine("postgresql+asyncpg://test:test@localhost:5432/datasage_test")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def test_session(test_db):
    async with AsyncSession(test_db) as session:
        yield session
```

### Test Factories

```python
# tests/factories/property_factory.py
class PropertyFactory:
    @staticmethod
    def create(**overrides):
        defaults = {
            "city_id": 1,
            "locality_id": 101,
            "property_type": "apartment",
            "bhk": 3,
            "area_sqft": 1450,
            "listing_price": 6500000,
            "floor_number": 4,
            "total_floors": 12,
            "facing": "east",
            "construction_year": 2019,
            "furnishing": "semi_furnished",
            "parking_count": 1,
            "is_active": True,
            "data_source": "seed",
        }
        return Property(**{**defaults, **overrides})
```

---

## ML Model Testing

| Test Type | What | How |
|-----------|------|-----|
| Unit: feature builder | Correct feature vector from property data | Fixed property → expected feature vector |
| Unit: SHAP explainer | SHAP values sum to prediction offset | Assert: base_value + sum(shap) ≈ prediction |
| Unit: scoring | Location score from known POI distances | Fixed distances → expected score |
| Integration: prediction | Full pipeline: property → features → prediction → response | Test with seeded properties in test DB |
| Regression: prediction stability | Same inputs → same outputs across code changes | Snapshot test with tolerance |
| Performance: inference time | Single prediction < 100ms | Benchmark test |
| Validation: model quality | MAPE, R² on test set | Training pipeline evaluation script |

### ML Test Data

- Use a fixed set of 10 "golden" properties with known expected predictions for regression testing.
- Golden data is versioned alongside the model.

---

## Frontend Testing

| Type | Tool | Target |
|------|------|--------|
| Unit (components) | Jest + React Testing Library | Button, Card, Badge, Filter components |
| Unit (hooks/utils) | Jest | useAuth, formatINR, API client |
| Integration | Jest + MSW | API integration, auth flow, data fetching |
| E2E | Playwright | Critical user flows |
| Accessibility | jest-axe | All pages |
| Visual regression | Playwright screenshots | Key pages (search, detail, compare) |

### MSW (Mock Service Worker)

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/properties', (req, res, ctx) => {
    return res(ctx.json({
      data: [mockProperty1, mockProperty2],
      pagination: { next_cursor: null, has_more: false, total_count: 2 },
    }));
  }),
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(ctx.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    }));
  }),
];
```

---

## E2E Tests (Playwright)

### Critical Flows to Test

| Flow | Steps | Assertions |
|------|-------|------------|
| Property search | Enter locality → filter → view results | Results appear, pricing badges visible |
| Property detail | Click property → view all sections | Pricing, map, AI analysis sections render |
| Auth flow | Register → login → access protected page | Token stored, protected content visible |
| Comparison | Add 2 properties → view comparison | Comparison table renders, best pick shown |
| Admin dataset upload | Login as admin → upload CSV → view report | Import summary shows counts |

---

## Data Validation Tests

```python
# Test that quality rules catch known bad data
def test_missing_area_detected():
    row = {"locality": "Sector 75", "bhk": 3, "listing_price": 5000000}
    errors = validate_row(row)
    assert "MISSING_AREA" in [e["code"] for e in errors]

def test_coordinates_out_of_bounds():
    row = valid_row | {"latitude": 19.0}  # Mumbai, not Delhi
    errors = validate_row(row)
    assert "COORDS_OUT_OF_BOUNDS" in [e["code"] for e in errors]
```

---

## CI Pipeline

```yaml
# .github/workflows/test.yml (conceptual)
test:
  steps:
    - Backend unit tests: pytest tests/unit/
    - Backend integration tests: pytest tests/integration/ (needs test DB)
    - Frontend unit tests: npm test
    - Lint: ruff check (Python), eslint (JS)
    - Type check: mypy (Python), tsc --noEmit (TS)
    - Security: pip-audit, npm audit
```

---

## Test Data Management

| Data Type | Storage | Lifecycle |
|-----------|---------|-----------|
| Unit test data | In-test fixtures | Created/destroyed per test |
| Integration test data | Test database | Created via factories, dropped after suite |
| E2E test data | Seed script | Loaded before suite, reset between tests |
| ML golden data | `tests/fixtures/golden_properties.json` | Versioned in git |

---

## Related Documents

- [05 — Non-Functional Requirements](05-non-functional-requirements.md)
- [08 — Backend Architecture](08-backend-architecture.md)
- [24 — Deployment](24-deployment.md)
- [30 — Acceptance Criteria](30-acceptance-criteria.md)
