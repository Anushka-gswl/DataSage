# 01 — Product Requirements

## Source Requirements

The following requirements are derived directly from the original project specification. Each is traceable to a system module.

### Core User Questions

| ID | User Question | Module | MVP? |
|----|--------------|--------|------|
| Q1 | Is this property fairly priced? | Property Valuation, Over/Underpricing | ✅ |
| Q2 | Is this property overpriced or underpriced? | Over/Underpricing Detection | ✅ |
| Q3 | What is the estimated fair market value? | Property Valuation | ✅ |
| Q4 | How good is the property's location? | Geospatial Intelligence | ✅ |
| Q5 | What schools, hospitals, transit, and amenities are nearby? | Geospatial Intelligence | ✅ |
| Q6 | How suitable is this property for my budget and lifestyle? | Recommendation Engine | ✅ |
| Q7 | Does this property have investment potential? | Investment Analysis | ✅ |
| Q8 | What are the strengths and weaknesses? | Explainable AI | ✅ |
| Q9 | What similar properties should I consider? | Recommendation Engine | ✅ |
| Q10 | Why is DataSage recommending or rejecting this property? | Explainable AI | ✅ |

### Source Capabilities

| ID | Capability | Description | Module Mapping |
|----|-----------|-------------|---------------|
| C1 | AI-powered property evaluation | ML-based analysis of property attributes and location | Property Valuation |
| C2 | Fair market value prediction | Regression model predicting price from features | Property Valuation |
| C3 | Over/underpriced detection | Classification based on listing vs. predicted price gap | Over/Underpricing Detection |
| C4 | OSM-based connectivity analysis | Proximity to transit, roads, employment hubs | Geospatial Intelligence |
| C5 | School and healthcare analysis | Nearby schools and hospitals from OSM | Geospatial Intelligence |
| C6 | Personalized recommendations | Budget, commute, lifestyle-aware property matching | Recommendation Engine |
| C7 | Explainable insights | SHAP-based feature explanations in natural language | Explainable AI |
| C8 | Investment scoring | Appreciation potential, rental yield signals | Investment Analysis |
| C9 | Suitability scoring | Preference-match score per property per user | Recommendation Engine |
| C10 | Property comparison | Side-by-side normalized comparison | Property Comparison |
| C11 | Delhi-NCR as MVP region | Scoped to 6 cities in Delhi-NCR | All modules |
| C12 | Multi-city expansion readiness | Architecture supports adding cities without rewrites | System Architecture |

---

## Functional Requirements Summary

### FR-AUTH: Authentication & User Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-AUTH-01 | Users can register with email and password | MVP |
| FR-AUTH-02 | Users can log in and receive JWT access + refresh tokens | MVP |
| FR-AUTH-03 | Users can reset password via email link | MVP |
| FR-AUTH-04 | Users have roles: `buyer`, `investor`, `professional`, `admin` | MVP |
| FR-AUTH-05 | Admins can list, activate, deactivate, and delete users | MVP |
| FR-AUTH-06 | OAuth2 social login (Google) | Future |

### FR-ONB: User Onboarding

| ID | Requirement | Priority |
|----|------------|----------|
| FR-ONB-01 | After first login, user is prompted to set preferences | MVP |
| FR-ONB-02 | Preferences include: budget range, preferred BHK, preferred localities, commute destination, lifestyle priorities | MVP |
| FR-ONB-03 | Onboarding can be skipped and completed later | MVP |
| FR-ONB-04 | Preferences are editable from the user profile | MVP |

### FR-SEARCH: Property Search

| ID | Requirement | Priority |
|----|------------|----------|
| FR-SEARCH-01 | Users can search properties by locality name | MVP |
| FR-SEARCH-02 | Users can filter by price range, BHK, area, property type | MVP |
| FR-SEARCH-03 | Search results show summary cards with key metrics | MVP |
| FR-SEARCH-04 | Search results can be sorted by price, relevance, valuation gap | MVP |
| FR-SEARCH-05 | Map-based search with property pins | Future |
| FR-SEARCH-06 | Search supports pagination (20 results per page) | MVP |

### FR-PROP: Property Details

| ID | Requirement | Priority |
|----|------------|----------|
| FR-PROP-01 | Property detail page shows all structural attributes | MVP |
| FR-PROP-02 | Property detail page shows listing price and predicted fair value | MVP |
| FR-PROP-03 | Property detail page shows location on an interactive map | MVP |
| FR-PROP-04 | Property detail page shows nearby amenities (schools, hospitals, transit) | MVP |
| FR-PROP-05 | Property detail page shows AI analysis (valuation, pricing classification, scores) | MVP |
| FR-PROP-06 | Property images displayed in a carousel | MVP |

### FR-VAL: Property Valuation

| ID | Requirement | Priority |
|----|------------|----------|
| FR-VAL-01 | System predicts fair market value for each property | MVP |
| FR-VAL-02 | Prediction includes a confidence interval (e.g., ₹45L – ₹52L) | MVP |
| FR-VAL-03 | Prediction is based on structural + locational features | MVP |
| FR-VAL-04 | Predictions are cached (TTL: 24 hours) and recomputed on data refresh | MVP |
| FR-VAL-05 | Prediction model version is recorded with each valuation | MVP |

### FR-PRICE: Over/Underpricing Detection

| ID | Requirement | Priority |
|----|------------|----------|
| FR-PRICE-01 | System classifies each property as overpriced, fairly priced, or underpriced | MVP |
| FR-PRICE-02 | Classification uses thresholds: overpriced (>+10%), fair (±10%), underpriced (>-10%) | MVP |
| FR-PRICE-03 | Exact percentage difference is displayed | MVP |
| FR-PRICE-04 | Classification is visually prominent on property cards and detail pages | MVP |

### FR-GEO: Geospatial Intelligence

| ID | Requirement | Priority |
|----|------------|----------|
| FR-GEO-01 | System queries OSM for POIs within a configurable radius (default: 5 km) | MVP |
| FR-GEO-02 | POI categories: schools, hospitals, metro stations, bus stops, parks, shopping, restaurants | MVP |
| FR-GEO-03 | System computes a composite location score (0–100) | MVP |
| FR-GEO-04 | Location score breakdown shows category-wise sub-scores | MVP |
| FR-GEO-05 | Nearby POIs are displayed on the property map | MVP |
| FR-GEO-06 | Isochrone analysis (walk/drive time contours) | Future |

### FR-REC: Recommendation Engine

| ID | Requirement | Priority |
|----|------------|----------|
| FR-REC-01 | System recommends properties matching user preferences | MVP |
| FR-REC-02 | Recommendations are ranked by a composite suitability score | MVP |
| FR-REC-03 | Each recommendation includes an explanation (why this property) | MVP |
| FR-REC-04 | System handles cold-start (new users with no preferences) via popularity-based defaults | MVP |
| FR-REC-05 | Users can provide feedback on recommendations (helpful/not helpful) | Future |

### FR-CMP: Property Comparison

| ID | Requirement | Priority |
|----|------------|----------|
| FR-CMP-01 | Users can select up to 4 properties for comparison | MVP |
| FR-CMP-02 | Comparison table normalizes metrics across properties | MVP |
| FR-CMP-03 | Compared metrics include: price, predicted value, price gap, location score, amenity counts, investment score, suitability score | MVP |
| FR-CMP-04 | Comparison highlights best/worst values per metric | MVP |

### FR-INV: Investment Analysis

| ID | Requirement | Priority |
|----|------------|----------|
| FR-INV-01 | System computes an investment score (0–100) per property | MVP |
| FR-INV-02 | Score factors include: locality price trend, infrastructure proximity, rental yield estimate | MVP |
| FR-INV-03 | Score breakdown is visible on the property detail page | MVP |
| FR-INV-04 | Historical price trend chart per locality | Future |

### FR-XAI: Explainable AI

| ID | Requirement | Priority |
|----|------------|----------|
| FR-XAI-01 | System provides SHAP-based feature contributions for each valuation | MVP |
| FR-XAI-02 | Feature contributions are translated to natural-language explanations | MVP |
| FR-XAI-03 | Explanations are displayed on the property detail page | MVP |
| FR-XAI-04 | Interactive SHAP waterfall chart | Future |

### FR-SAVE: Saved Properties

| ID | Requirement | Priority |
|----|------------|----------|
| FR-SAVE-01 | Authenticated users can save/unsave properties | MVP |
| FR-SAVE-02 | Saved properties are accessible from the user dashboard | MVP |
| FR-SAVE-03 | Saved properties show price change alerts | Future |

### FR-HIST: Search History

| ID | Requirement | Priority |
|----|------------|----------|
| FR-HIST-01 | System records search queries for authenticated users | MVP |
| FR-HIST-02 | Users can view and clear their search history | MVP |

### FR-ADMIN: Admin Dashboard

| ID | Requirement | Priority |
|----|------------|----------|
| FR-ADMIN-01 | Admin can view system health metrics (API latency, error rates) | MVP |
| FR-ADMIN-02 | Admin can manage datasets (upload, review, activate) | MVP |
| FR-ADMIN-03 | Admin can view and manage ML model versions | MVP |
| FR-ADMIN-04 | Admin can view data quality reports | MVP |
| FR-ADMIN-05 | Admin can manage users (list, activate, deactivate) | MVP |
| FR-ADMIN-06 | Admin can view audit logs | MVP |

---

## Assumptions Register

These assumptions are made where the original requirements are ambiguous. Each is tagged with a risk level.

| ID | Assumption | Risk | Mitigation |
|----|-----------|------|-----------|
| A1 | Property data will be sourced from publicly available government records (circle rates, registrar data) and synthetic seed data. We do not have access to MagicBricks, 99acres, or Housing.com APIs. | High | Clearly label all seed data as synthetic. Design the ingestion pipeline to accept real data when available. |
| A2 | The ML valuation model will be trained on a combination of government circle rates, DDA auction prices, and any available open datasets. Model accuracy is not guaranteed until training is complete. | High | Set realistic accuracy targets (MAPE < 15%). Document actual performance after evaluation. |
| A3 | OpenStreetMap data for Delhi-NCR is sufficiently complete for POI analysis. | Medium | Validate OSM coverage during data ingestion. Flag areas with sparse POI data. |
| A4 | Users will provide preference data during onboarding for the recommendation engine to function effectively. | Medium | Implement cold-start handling with popularity-based defaults. |
| A5 | The pricing classification thresholds (±10%) are appropriate for Delhi-NCR market conditions. | Medium | Make thresholds configurable per city. Validate against domain expert feedback. |
| A6 | BHK (Bedroom-Hall-Kitchen) is the standard unit for property size classification in India, as opposed to just "bedrooms". | Low | Use BHK consistently across the system. |
| A7 | Property prices in the dataset are in INR (Indian Rupees). | Low | Enforce currency validation during ingestion. |
| A8 | Users accessing the platform are primarily English-speaking. Hindi/multilingual support is a future consideration. | Medium | Design i18n-ready string externalization from day one, but only implement English initially. |

---

## Data Source Reality Check

| Source | Status | Type | Notes |
|--------|--------|------|-------|
| Delhi circle rates (govt.) | Available | Public | Published annually by Delhi govt. Provides per-locality baseline rates by property type. |
| DDA auction data | Partially available | Public | Some historical auction results are publicly accessible. |
| Property registration data | Limited | Public | Some states publish registration summaries; granularity varies. |
| OpenStreetMap (Overpass API) | Available | Open | Free, rate-limited. Good POI coverage for Delhi-NCR. |
| MagicBricks / 99acres / Housing.com | Not available | Commercial | No API access. Not assumed in this system. |
| Government RERA data | Partially available | Public | Project-level data; not property-level pricing. |
| Census data | Available | Public | Demographics, infrastructure data at ward/district level. |
| Synthetic seed data | Will be generated | Synthetic | Clearly labeled. For development and demo purposes only. |

---

## Related Documents

- [00 — Project Overview](00-project-overview.md)
- [04 — Functional Requirements (detailed)](04-functional-requirements.md)
- [05 — Non-Functional Requirements](05-non-functional-requirements.md)
- [28 — MVP vs Future Scope](28-mvp-vs-future-scope.md)
- [29 — Risks & Assumptions](29-risks-and-assumptions.md)
