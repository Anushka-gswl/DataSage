# 04 — Functional Requirements

## Overview

This document expands each product module into detailed functional requirements with acceptance criteria. Requirements are tagged as **MVP** or **Future**. Each requirement has a unique ID for traceability.

See [01 — Product Requirements](01-product-requirements.md) for the summary table and [30 — Acceptance Criteria](30-acceptance-criteria.md) for Given/When/Then format.

---

## Module 1: Authentication & User Management

**Purpose**: Secure user registration, login, session management, and role-based access.

### Requirements

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-AUTH-01 | Email/password registration | Collect: name, email, password. Hash password with bcrypt (cost=12). Create user record with role=`buyer` (default). Return JWT access+refresh tokens. | MVP |
| FR-AUTH-02 | Login | Validate email+password. Return JWT pair. Record `last_login_at`. | MVP |
| FR-AUTH-03 | Token refresh | Accept valid refresh token. Return new access+refresh pair. Invalidate old refresh token (rotation). | MVP |
| FR-AUTH-04 | Logout | Invalidate refresh token. Client discards access token. | MVP |
| FR-AUTH-05 | Password reset | Send password reset email with time-limited token (15 min expiry). User sets new password. Invalidate all active sessions. | MVP |
| FR-AUTH-06 | Role-based access | Roles: `buyer`, `investor`, `professional`, `admin`. Role determines accessible API endpoints and UI sections. | MVP |
| FR-AUTH-07 | Profile management | User can update name, email (with re-verification), password. | MVP |
| FR-AUTH-08 | Account deactivation | User can deactivate own account. Soft-delete: set `is_active=false`, anonymize PII after 30 days. | MVP |
| FR-AUTH-09 | Admin user management | Admin can list users (paginated, filterable by role/status), activate/deactivate accounts, change roles. | MVP |
| FR-AUTH-10 | OAuth2 social login | Google OAuth2 integration. Map Google profile to local user record. | Future |

### Business Rules

- Password policy: ≥8 characters, ≥1 uppercase, ≥1 digit. No common passwords (check against top 10,000 list).
- Email verification: Send verification email on registration. User can browse but cannot save properties or set preferences until verified.
- Rate limiting: Login endpoint limited to 10 attempts/minute per IP. Account locked after 5 consecutive failed attempts (unlock via password reset or admin).
- Session concurrency: Allow up to 5 active refresh tokens per user. Oldest invalidated when limit exceeded.

---

## Module 2: User Onboarding

**Purpose**: Collect user preferences to power personalized recommendations.

### Requirements

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-ONB-01 | Post-registration onboarding flow | Multi-step wizard presented after first login. Skippable. | MVP |
| FR-ONB-02 | Budget range | Min/max budget in INR. UI: dual-handle slider with manual input. Range: ₹5L – ₹50Cr. | MVP |
| FR-ONB-03 | BHK preference | Multi-select: 1 BHK, 2 BHK, 3 BHK, 4+ BHK. At least 1 required if step not skipped. | MVP |
| FR-ONB-04 | Preferred localities | Multi-select from Delhi-NCR locality list (autocomplete). Max 10 selections. | MVP |
| FR-ONB-05 | Commute destination | Single address or landmark (geocoded to lat/lng). Optional. Used for commute-time scoring. | MVP |
| FR-ONB-06 | Lifestyle priorities | Rank 5 categories by importance: schools, metro/transit, parks/green, shopping/dining, hospitals. Stored as ordered list. | MVP |
| FR-ONB-07 | Property type preference | Multi-select: Apartment, Builder Floor, Independent House. | MVP |
| FR-ONB-08 | Preference editing | Full preference re-configuration from Profile → Preferences page. | MVP |
| FR-ONB-09 | Progressive profiling | If user skipped onboarding, show contextual prompts (e.g., "Set your budget to see personalized recommendations") in relevant UI sections. | MVP |

### Business Rules

- All preference fields are optional individually. The recommendation engine degrades gracefully with missing preferences.
- Budget is stored as `budget_min` and `budget_max` (integer, INR).
- Localities are stored as foreign keys to a `Locality` reference table with city scope.
- Commute destination is geocoded on save and stored as a PostGIS POINT.

---

## Module 3: Property Search

**Purpose**: Allow users to discover properties through text search and filters.

### Requirements

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-SEARCH-01 | Locality-based search | Text input with autocomplete against locality names. Returns properties in the selected locality. | MVP |
| FR-SEARCH-02 | Price filter | Range filter: min/max price. | MVP |
| FR-SEARCH-03 | BHK filter | Multi-select: 1, 2, 3, 4+. | MVP |
| FR-SEARCH-04 | Area filter | Range filter: min/max area in sqft. | MVP |
| FR-SEARCH-05 | Property type filter | Multi-select: Apartment, Builder Floor, Independent House, Plot. | MVP |
| FR-SEARCH-06 | Sorting | Options: relevance (default), price low-to-high, price high-to-low, newest first, valuation gap (most underpriced first). | MVP |
| FR-SEARCH-07 | Pagination | 20 results per page. Cursor-based pagination for stable results. | MVP |
| FR-SEARCH-08 | Result cards | Each card shows: property image (or placeholder), title, locality, price, BHK, area, predicted value, pricing badge (over/fair/under), location score. | MVP |
| FR-SEARCH-09 | Map-based search | Interactive map with property pins. Click pin to see summary popup. Drag/zoom to search within viewport. | Future |
| FR-SEARCH-10 | Search history recording | For authenticated users, record search queries with timestamp. | MVP |
| FR-SEARCH-11 | Saved search filters | User can save a filter combination and be notified when new properties match. | Future |

### Business Rules

- Empty search (no locality, no filters) returns trending/popular properties.
- Autocomplete locality search queries the `Locality` table, scoped to the user's selected city (default: Delhi-NCR).
- Result cards for unauthenticated users show all data except suitability score (requires preferences).
- Valuation gap sort requires predicted values. Properties without predictions are sorted last.

---

## Module 4: Property Details

**Purpose**: Comprehensive single-property view with all available data and AI analysis.

### Requirements

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-PROP-01 | Property header | Title (auto-generated: "{BHK} BHK {type} in {locality}"), full address, listing date. | MVP |
| FR-PROP-02 | Image gallery | Carousel of property images. Placeholder image if none available. | MVP |
| FR-PROP-03 | Structural attributes | BHK, area (sqft), floor/total floors, facing, age/construction year, furnishing status, parking, balconies, bathrooms. | MVP |
| FR-PROP-04 | Pricing section | Listing price, predicted fair value, confidence interval, price gap %, pricing classification badge. | MVP |
| FR-PROP-05 | Location section | Interactive map centered on property, nearby POIs as markers, location score with sub-score breakdown. | MVP |
| FR-PROP-06 | Investment section | Investment score, locality trend, infrastructure notes, rental yield estimate. | MVP |
| FR-PROP-07 | AI explanation | Top 3 positive factors, top 3 negative factors, SHAP feature contribution summary. | MVP |
| FR-PROP-08 | Similar properties | 3–5 comparable properties based on locality, BHK, price range. | MVP |
| FR-PROP-09 | Save/unsave | Toggle save button. Requires authentication. | MVP |
| FR-PROP-10 | Add to comparison | Button to add to comparison list (max 4). | MVP |
| FR-PROP-11 | Share property | Copy link to clipboard. Future: share via WhatsApp/email. | MVP |
| FR-PROP-12 | Report issue | User can flag incorrect data. Logged for admin review. | Future |

---

## Module 5: Property Valuation

**Purpose**: ML-based fair market value prediction.

### Requirements

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-VAL-01 | Predict fair value | Input: property features. Output: predicted price (INR), confidence interval (±). Model: gradient-boosted regression. | MVP |
| FR-VAL-02 | Confidence interval | Report prediction interval at 90% confidence level. Display as range (e.g., "₹45L – ₹52L"). | MVP |
| FR-VAL-03 | Model versioning | Each prediction is tagged with the model version that produced it. | MVP |
| FR-VAL-04 | Prediction caching | Cache predictions keyed by (property_id, model_version). TTL: 24 hours. Invalidate on property data change. | MVP |
| FR-VAL-05 | Batch prediction | API endpoint for predicting values for a batch of properties (admin use, data pipeline). Max batch size: 100. | MVP |
| FR-VAL-06 | Minimum data requirements | Prediction requires at minimum: area_sqft, bhk, locality, latitude, longitude. If missing, return error with list of missing fields. | MVP |

---

## Module 6: Over/Underpricing Detection

**Purpose**: Classify properties based on listing price vs. predicted value.

### Requirements

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-PRICE-01 | Price gap calculation | `gap_pct = ((listing_price - predicted_value) / predicted_value) * 100` | MVP |
| FR-PRICE-02 | Classification | Overpriced: gap > +10%. Fair: gap between -10% and +10%. Underpriced: gap < -10%. | MVP |
| FR-PRICE-03 | Configurable thresholds | Thresholds stored in system config. Admin can adjust per city. | MVP |
| FR-PRICE-04 | Visual badge | Color-coded badge on property cards and detail pages. Red: overpriced. Green: underpriced. Blue: fair. | MVP |
| FR-PRICE-05 | Price gap display | Show exact percentage and absolute difference (e.g., "Overpriced by 12.3% (₹8.5L above fair value)"). | MVP |

---

## Module 7: Geospatial Intelligence

**Purpose**: Location analysis using PostGIS and OpenStreetMap data.

### Requirements

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-GEO-01 | POI query | Query OSM Overpass API for POIs within a configurable radius around a property's coordinates. | MVP |
| FR-GEO-02 | POI categories | Schools, hospitals/clinics, metro stations, bus stops, parks, shopping malls/markets, restaurants, banks/ATMs. | MVP |
| FR-GEO-03 | POI caching | Cache OSM query results in PostgreSQL. Re-query interval: 30 days per area. | MVP |
| FR-GEO-04 | Location score | Composite score 0–100 from weighted sub-scores per POI category. Weights configurable per city. | MVP |
| FR-GEO-05 | Sub-scores | Each POI category gets a sub-score based on: count of POIs within radius, distance to nearest POI, quality signals (if available). | MVP |
| FR-GEO-06 | Map visualization | Leaflet map with property marker + POI markers categorized by icon/color. | MVP |
| FR-GEO-07 | Distance calculations | Use PostGIS `ST_Distance` with geography type for accurate distance in meters. | MVP |
| FR-GEO-08 | Isochrone analysis | Walk/drive time contours from property location (5 min, 10 min, 15 min). | Future |
| FR-GEO-09 | Commute time estimation | If user has set commute destination, estimate commute time via public transit (OSRM or similar). | Future |

---

## Module 8: Recommendation Engine

Detailed in [15 — Recommendation Engine](15-recommendation-engine.md).

### Summary Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| FR-REC-01 | Content-based filtering using user preferences | MVP |
| FR-REC-02 | Composite suitability score per property per user | MVP |
| FR-REC-03 | Natural-language recommendation reasons | MVP |
| FR-REC-04 | Cold-start handling (popularity-based fallback) | MVP |
| FR-REC-05 | Negative feedback integration (dismiss) | Future |

---

## Module 9: Property Comparison

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-CMP-01 | Select properties | Add/remove properties from comparison list (max 4). Persist in client-side state (localStorage for unauth, server for auth). | MVP |
| FR-CMP-02 | Comparison table | Side-by-side table with rows: price, predicted value, gap %, location score, BHK, area, investment score, suitability score. | MVP |
| FR-CMP-03 | Metric highlighting | Highlight best value per row (lowest price, highest score, etc.). | MVP |
| FR-CMP-04 | Best pick badge | Overall recommendation based on weighted aggregate of all comparison metrics. | MVP |
| FR-CMP-05 | Responsive layout | Table on desktop (≥768px), vertical cards on mobile (<768px). | MVP |

---

## Module 10: Investment Analysis

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-INV-01 | Investment score | Composite 0–100 score based on: locality price trend, infrastructure proximity, rental yield estimate, demand signals. | MVP |
| FR-INV-02 | Locality price trend | Average price change (%) over past 1, 3, 5 years for the property's locality. Source: historical data in dataset. | MVP |
| FR-INV-03 | Infrastructure proximity | Distance to upcoming infrastructure (metro extensions, highways, airports, commercial hubs). | MVP |
| FR-INV-04 | Rental yield estimate | Estimated annual rental yield as % of property value. Based on locality rental market data (if available) or regional average. | MVP |
| FR-INV-05 | Score breakdown | Display individual factor contributions to the investment score. | MVP |

---

## Module 11: Explainable AI

Detailed in [16 — Explainable AI](16-explainable-ai.md).

### Summary Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| FR-XAI-01 | SHAP feature contributions per valuation prediction | MVP |
| FR-XAI-02 | Natural-language explanation generation | MVP |
| FR-XAI-03 | Top-3 positive and top-3 negative factors | MVP |
| FR-XAI-04 | Explanation templates for common patterns | MVP |
| FR-XAI-05 | Interactive SHAP waterfall chart | Future |

---

## Module 12: Saved Properties

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-SAVE-01 | Save/unsave toggle | Authenticated users can save properties. Stored in `SavedProperty` table. | MVP |
| FR-SAVE-02 | Saved list | Dashboard section showing all saved properties with current pricing data. | MVP |
| FR-SAVE-03 | Price change notification | Alert user when saved property's listing price changes. | Future |

---

## Module 13: Search History

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-HIST-01 | Record searches | Store search query (locality, filters) + timestamp for authenticated users. | MVP |
| FR-HIST-02 | View history | Chronological list on user dashboard. Max 50 entries displayed. | MVP |
| FR-HIST-03 | Clear history | User can clear all search history. Hard delete. | MVP |
| FR-HIST-04 | Re-run search | Click a history entry to re-execute the same search. | MVP |

---

## Module 14: Admin Dashboard

See Flow 6 in [03 — User Flows](03-user-flows.md) for detailed admin flow. Requirements are covered under FR-ADMIN-01 through FR-ADMIN-06 in the summary table.

---

## Module 15: Dataset Management (Admin)

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-DATA-01 | Upload dataset | Accept CSV or JSON files. Validate schema against expected columns. | MVP |
| FR-DATA-02 | Dataset versioning | Each upload creates a new dataset version. Previous versions are retained. | MVP |
| FR-DATA-03 | Dataset status | Statuses: `draft` (uploaded, not validated), `active` (validated, in use), `archived` (superseded). | MVP |
| FR-DATA-04 | Activate dataset | Admin promotes a draft dataset to active after reviewing quality report. Old active dataset is archived. | MVP |
| FR-DATA-05 | Import history | Log each import: timestamp, file name, row count, validation results, imported by. | MVP |

---

## Module 16: ML Model Management (Admin)

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-ML-01 | Model version list | Show all trained model versions with: version ID, training date, dataset used, performance metrics. | MVP |
| FR-ML-02 | Active model indicator | Clearly show which model version is currently serving predictions. | MVP |
| FR-ML-03 | Promote model | Admin can promote a model version to active. Requires confirmation. | MVP |
| FR-ML-04 | Rollback model | Admin can revert to a previous model version. | MVP |
| FR-ML-05 | Performance dashboard | Show key metrics: MAPE, R², MAE, prediction count, average confidence. | MVP |

---

## Module 17: System Monitoring (Admin)

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-MON-01 | Health check endpoint | `/health` returns service status, DB connectivity, Redis status, ML model loaded. | MVP |
| FR-MON-02 | Metrics dashboard | API latency (p50/p95/p99), error rate, active users, request volume. | MVP |
| FR-MON-03 | Audit logs | Log admin actions: user management, dataset changes, model promotions. Filterable by actor, action, timestamp. | MVP |

---

## Module 18: Notifications

| ID | Requirement | Detail | Priority |
|----|------------|--------|----------|
| FR-NOTIF-01 | In-app notification bell | Show unread notification count. Dropdown list of recent notifications. | Future |
| FR-NOTIF-02 | Price change alerts | Notify when saved property price changes. | Future |
| FR-NOTIF-03 | New recommendation alerts | Notify when new properties match user preferences. | Future |
| FR-NOTIF-04 | Email notifications | Email digest of saved property price changes and new recommendations. | Future |

---

## Related Documents

- [01 — Product Requirements](01-product-requirements.md)
- [03 — User Flows](03-user-flows.md)
- [10 — API Specification](10-api-specification.md)
- [30 — Acceptance Criteria](30-acceptance-criteria.md)
