# 26 — Project Structure

## Overview

DataSage is organized as a monorepo with separate frontend, backend, ML, and data directories.

---

## Full Directory Tree

```
DataSage/
├── README.md
├── CHANGELOG.md
├── LICENSE
├── .env.example
├── .gitignore
├── docker-compose.yml
│
├── docs/                              # All documentation (this directory)
│   ├── 00-project-overview.md
│   ├── 01-product-requirements.md
│   ├── ... (all 32+ documents)
│   └── assets/                        # Diagrams, images for docs
│
├── frontend/                          # Next.js 14 application
│   ├── public/
│   │   ├── images/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/                       # App Router pages
│   │   ├── components/                # React components
│   │   │   ├── common/                # Shared (Button, Card, Modal, etc.)
│   │   │   ├── layout/                # Navbar, Footer, Sidebar
│   │   │   ├── property/              # Property-specific components
│   │   │   ├── search/                # Search components
│   │   │   ├── map/                   # Map components
│   │   │   ├── dashboard/             # User dashboard components
│   │   │   ├── onboarding/            # Onboarding wizard steps
│   │   │   └── admin/                 # Admin dashboard components
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── lib/                       # Utilities (api client, formatters)
│   │   ├── contexts/                  # React Context providers
│   │   └── styles/                    # CSS Modules, design tokens
│   ├── tests/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── mocks/                     # MSW handlers
│   │   └── e2e/                       # Playwright tests
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── jest.config.ts
│   ├── playwright.config.ts
│   └── package.json
│
├── backend/                           # FastAPI application
│   ├── datasage/
│   │   ├── __init__.py
│   │   ├── main.py                    # App factory
│   │   ├── core/                      # Config, security, DB, middleware
│   │   ├── api/v1/                    # Route handlers
│   │   ├── models/                    # SQLAlchemy ORM models
│   │   ├── schemas/                   # Pydantic schemas
│   │   ├── services/                  # Business logic
│   │   ├── repositories/             # Data access layer
│   │   ├── ml/                        # ML inference (runtime)
│   │   ├── geo/                       # Geospatial services
│   │   └── cli/                       # CLI commands (seed, admin)
│   ├── migrations/                    # Alembic migrations
│   │   ├── alembic.ini
│   │   ├── env.py
│   │   └── versions/
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── unit/
│   │   ├── integration/
│   │   └── factories/
│   ├── pyproject.toml
│   └── requirements.txt
│
├── ml/                                # ML training pipeline (offline)
│   ├── notebooks/                     # Jupyter exploration
│   ├── training/                      # Training scripts
│   │   ├── train_valuation.py
│   │   ├── evaluate.py
│   │   └── tune_hyperparams.py
│   ├── evaluation/                    # Evaluation reports
│   ├── models/                        # Serialized model artifacts
│   │   └── v1.0/
│   │       ├── model.joblib
│   │       └── metadata.json
│   └── requirements.txt
│
├── data/
│   ├── seed/                          # Synthetic seed datasets (labeled)
│   │   ├── properties_delhi_ncr.csv
│   │   ├── localities.csv
│   │   ├── circle_rates.csv
│   │   └── README.md                  # Data dictionary + synthetic data notice
│   └── raw/                           # Downloaded raw data (.gitignored)
│
├── docker/                            # Dockerfiles
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
│
├── nginx/                             # Nginx config
│   └── nginx.conf
│
└── scripts/                           # Utility scripts
    ├── setup-dev.sh                   # Dev environment setup
    ├── seed-data.sh                   # Load seed data
    └── backup-db.sh                   # Database backup
```

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Python files | snake_case | `auth_service.py` |
| Python classes | PascalCase | `PropertyService` |
| Python functions | snake_case | `get_property_by_id` |
| Python constants | UPPER_SNAKE | `MAX_COMPARISON_ITEMS` |
| TypeScript files | PascalCase for components, camelCase for utils | `PropertyCard.tsx`, `formatINR.ts` |
| TypeScript components | PascalCase | `PropertyCard` |
| TypeScript hooks | camelCase with `use` prefix | `useProperties` |
| CSS Modules | PascalCase filename, camelCase classes | `PropertyCard.module.css`, `.cardTitle` |
| API endpoints | kebab-case | `/saved-properties`, `/search-history` |
| Database tables | snake_case | `valuation_prediction` |
| Database columns | snake_case | `listing_price` |
| Environment variables | UPPER_SNAKE | `POSTGRES_HOST` |
| Git branches | `feature/`, `fix/`, `docs/` prefix | `feature/property-comparison` |
| Commits | Conventional Commits | `feat(search): add locality autocomplete` |

---

## Related Documents

- [06 — System Architecture](06-system-architecture.md)
- [07 — Frontend Architecture](07-frontend-architecture.md)
- [08 — Backend Architecture](08-backend-architecture.md)
- [32 — Contributing](32-contributing.md)
