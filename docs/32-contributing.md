# 32 — Contributing

## Overview

Guidelines for contributing to DataSage, whether you're a human developer or an AI coding agent.

---

## Development Setup

### Prerequisites

- Docker Desktop ≥ 24.0
- Docker Compose ≥ 2.20
- Node.js ≥ 18 (for frontend development outside Docker)
- Python ≥ 3.11 (for backend development outside Docker)
- Git

### Setup Steps

```bash
# 1. Clone
git clone https://github.com/your-org/datasage.git
cd datasage

# 2. Environment
cp .env.example .env
# Edit .env with your local settings

# 3. Start services
docker compose up -d

# 4. Seed demo data
docker compose exec backend python -m datasage.cli seed --demo

# 5. Verify
curl http://localhost:8000/health
# Should return {"status": "healthy", ...}
open http://localhost:3000
```

---

## Branching Strategy

```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Phase 1 start"
    branch feature/auth
    checkout feature/auth
    commit id: "Add registration"
    commit id: "Add login"
    checkout develop
    merge feature/auth
    branch feature/search
    checkout feature/search
    commit id: "Add search API"
    checkout develop
    merge feature/search
    checkout main
    merge develop tag: "v0.1.0"
```

| Branch | Purpose | Merges To |
|--------|---------|-----------|
| `main` | Production-ready code | — |
| `develop` | Integration branch | `main` (on release) |
| `feature/*` | New features | `develop` |
| `fix/*` | Bug fixes | `develop` |
| `docs/*` | Documentation only | `develop` |
| `hotfix/*` | Urgent production fixes | `main` AND `develop` |

---

## Pull Request Process

### PR Checklist

- [ ] Code follows project conventions (see [31 — AI Agent Rules](31-ai-agent-rules.md))
- [ ] All existing tests pass
- [ ] New tests written for new functionality
- [ ] No lint warnings (`ruff check`, `eslint`)
- [ ] No type errors (`mypy`, `tsc --noEmit`)
- [ ] Documentation updated (if behavior changed)
- [ ] CHANGELOG.md updated (if user-facing change)
- [ ] PR description explains **what** and **why**

### PR Template

```markdown
## What

Brief description of the change.

## Why

Link to requirement ID (e.g., FR-SEARCH-01) or issue.

## How

Implementation approach. Mention any architectural decisions.

## Testing

How this was tested. Which acceptance criteria it satisfies.

## Screenshots

If UI change, include before/after screenshots.
```

### Code Review Standards

| Aspect | Check |
|--------|-------|
| Correctness | Does the code do what it claims? |
| Architecture | Does it follow layer boundaries? |
| Security | Any PII logging? Input validation? SQL injection? |
| Performance | Any N+1 queries? Missing indexes? Uncached expensive operations? |
| Testing | Are edge cases covered? Are mocks realistic? |
| Naming | Do names follow conventions? Are they descriptive? |
| Documentation | Are complex decisions commented? Are docs updated? |

---

## Running Tests

```bash
# Backend unit tests
docker compose exec backend pytest tests/unit/ -v

# Backend integration tests (requires test DB)
docker compose exec backend pytest tests/integration/ -v

# Backend all tests with coverage
docker compose exec backend pytest --cov=datasage --cov-report=html

# Frontend unit tests
docker compose exec frontend npm test

# Frontend E2E tests
docker compose exec frontend npx playwright test

# Lint (Python)
docker compose exec backend ruff check .

# Lint (TypeScript)
docker compose exec frontend npm run lint

# Type check (Python)
docker compose exec backend mypy datasage/

# Type check (TypeScript)
docker compose exec frontend npx tsc --noEmit
```

---

## Issue Templates

### Bug Report

```markdown
**Describe the bug**: Clear description.
**Steps to reproduce**: 1. 2. 3.
**Expected behavior**: What should happen.
**Actual behavior**: What actually happens.
**Screenshots**: If applicable.
**Environment**: Browser, OS, DataSage version.
```

### Feature Request

```markdown
**Feature**: Name of the feature.
**Requirement ID**: e.g., FR-SEARCH-09
**User story**: As a [persona], I want to [action], so that [benefit].
**Acceptance criteria**: Given/When/Then.
**Additional context**: Wireframes, data requirements, etc.
```

---

## Related Documents

- [26 — Project Structure](26-project-structure.md)
- [31 — AI Agent Rules](31-ai-agent-rules.md)
- [23 — Testing Strategy](23-testing-strategy.md)
- [24 — Deployment](24-deployment.md)
