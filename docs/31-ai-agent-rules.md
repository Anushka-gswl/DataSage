# 31 — AI Agent Rules

## Overview

These rules govern how AI coding agents (Copilot, Cursor, Antigravity, etc.) should operate when contributing to the DataSage codebase.

---

## General Rules

1. **Read before writing**: Before modifying any file, read the corresponding documentation in `/docs/`. Every architectural decision is documented with rationale.
2. **No fabrication**: Never fabricate API responses, ML accuracy numbers, property listings, or test results. If data is needed, generate clearly labeled synthetic data.
3. **No silent decisions**: If you encounter ambiguity not covered by the docs, document your assumption in the code comment AND in `29-risks-and-assumptions.md`.
4. **Preserve existing patterns**: Match existing code style, naming conventions, and architectural patterns. Don't introduce a new pattern without documenting why.

---

## Code Style

### Python (Backend)

| Rule | Standard |
|------|----------|
| Formatter | `ruff format` (Black-compatible) |
| Linter | `ruff check` |
| Type checker | `mypy --strict` |
| Line length | 100 characters |
| Import order | stdlib → third-party → local (ruff enforces) |
| Docstrings | Google style for public functions/classes |
| Type hints | Required on all function signatures |

### TypeScript (Frontend)

| Rule | Standard |
|------|----------|
| Linter | ESLint (Next.js preset) |
| Formatter | Prettier |
| Type checking | `tsc --noEmit` (strict mode) |
| Component pattern | Functional components with hooks |
| Exports | Named exports (no default exports except pages) |

---

## Naming Conventions

Follow [26 — Project Structure](26-project-structure.md) naming section exactly:

- Python: `snake_case` files, `PascalCase` classes, `snake_case` functions
- TypeScript: `PascalCase` components, `camelCase` functions, `PascalCase.tsx` files
- API: `kebab-case` URLs
- Database: `snake_case` tables and columns
- Environment: `UPPER_SNAKE_CASE`

---

## Git Conventions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

Scopes: `auth`, `search`, `valuation`, `geo`, `recommendations`, `comparison`, `admin`, `ml`, `frontend`, `backend`, `docs`, `infra`

Examples:
```
feat(search): add locality autocomplete with debounced input
fix(valuation): handle missing floor_number in feature builder
docs(api): add comparison endpoint examples
test(auth): add integration tests for token refresh flow
chore(deps): update xgboost to 2.0.1
```

### Branch Naming

```
feature/FR-SEARCH-01-locality-autocomplete
fix/valuation-missing-floor-handling
docs/api-comparison-examples
```

---

## Architecture Rules

1. **Layer dependencies**: Routers depend on Services. Services depend on Repositories. Never skip a layer.
2. **No business logic in routers**: Routers handle HTTP concerns only (request parsing, response formatting, auth guards).
3. **No SQL in services**: All database queries go through Repository classes.
4. **No direct model imports in routers**: Use schemas (Pydantic) for request/response. Models (SQLAlchemy) stay in repositories.
5. **Feature flags**: Use `settings.FEATURE_*` to gate new features. Never hardcode feature availability.

---

## ML Rules

1. **Never fabricate metrics**: Report "not yet evaluated" until actual evaluation is run.
2. **Always log model version**: Every prediction records the `model_version_id`.
3. **Cache predictions**: Use Redis cache with `pred:{property_id}:{model_version}` key.
4. **Validate inputs**: Run `FeatureBuilder.validate()` before prediction. Return `INSUFFICIENT_DATA` if required features are missing.
5. **SHAP values must sum**: Verify `base_value + sum(shap_values) ≈ prediction` in tests.

---

## Testing Rules

1. **No tests that depend on external APIs**: Mock all external calls (Overpass, email) in tests.
2. **Use factories**: Create test data via factory classes, not raw SQL or fixtures.
3. **Test edge cases**: Every function that handles user input must have tests for invalid input, empty input, and boundary values.
4. **No `@pytest.mark.skip` without explanation**: If a test is skipped, document why.

---

## Documentation Rules

1. **Update docs when changing behavior**: If you change an API response format, update `10-api-specification.md`.
2. **Add to CHANGELOG**: Every user-facing change gets a CHANGELOG entry.
3. **Preserve comments**: Don't delete existing code comments unless they are factually wrong.
4. **Cross-reference**: When adding a new module, add it to the README documentation index.

---

## Security Rules

1. **Never log PII**: Email, name, passwords, tokens must never appear in log output.
2. **Never hardcode secrets**: All secrets via environment variables.
3. **Always validate server-side**: Frontend validation is for UX; server-side validation is for security.
4. **SQL injection prevention**: Always use SQLAlchemy ORM or parameterized queries. Never concatenate user input into SQL strings.

---

## Related Documents

- [26 — Project Structure](26-project-structure.md)
- [32 — Contributing](32-contributing.md)
- [19 — Security](19-security.md)
- [23 — Testing Strategy](23-testing-strategy.md)
