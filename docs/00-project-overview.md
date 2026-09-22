# 00 — Project Overview

## Product Identity

**DataSage — The AI Behind Better Buys**

DataSage is an AI-powered real-estate decision-support platform that helps users evaluate residential properties in Delhi-NCR, India. It combines machine-learning valuation, geospatial intelligence from OpenStreetMap, and explainable AI to answer the fundamental question: *"Is this property a good deal?"*

---

## Problem Statement

Residential property transactions in India suffer from severe information asymmetry:

1. **No transparent pricing**: Unlike stocks, property prices are opaque. Buyers rely on broker quotes and gut feel.
2. **Location evaluation is manual**: Assessing schools, hospitals, transit, and future infrastructure requires hours of fragmented research.
3. **No personalization**: Property portals list everything — they don't filter by commute, lifestyle, or investment goals.
4. **Overpricing is rampant**: Sellers/brokers often inflate prices by 10–30% over fair market value. Buyers have no tool to detect this.
5. **No investment analysis**: First-time investors lack tools to evaluate appreciation potential, rental yield, or infrastructure growth signals.

---

## Solution

DataSage addresses each problem with a specific capability:

| Problem | DataSage Capability | Module |
|---------|-------------------|--------|
| Opaque pricing | ML-based fair market value prediction | Property Valuation |
| Overpricing | Price-gap detection (listing vs. predicted) | Over/Underpricing Detection |
| Manual location research | Automated OSM-based proximity analysis | Geospatial Intelligence |
| No personalization | Budget, commute, lifestyle-aware recommendations | Recommendation Engine |
| No investment analysis | Appreciation signals, infrastructure scoring | Investment Analysis |
| Black-box recommendations | SHAP-based explanations in plain language | Explainable AI |

---

## Target Market

### Primary: Delhi-NCR Residential Property Buyers

- **Geography**: Delhi, Gurgaon (Gurugram), Noida, Greater Noida, Faridabad, Ghaziabad
- **Property types**: Apartments, builder floors, independent houses, plots (MVP: apartments and builder floors only)
- **Price range**: ₹20 lakh – ₹10 crore (covers ~90% of residential transactions in the region)

### Secondary: Real Estate Professionals

- Brokers and agents who want data-driven insights for client conversations
- Property analysts evaluating portfolios

### Expansion Strategy

The system architecture uses **city-scoped configuration** (geofences, model weights, feature distributions) so that adding a new city requires:
1. Ingesting property data for that city
2. Training/fine-tuning the valuation model on city-specific data
3. Loading OSM POI data for the city's bounding box
4. Configuring the city geofence in the admin panel

No schema changes, no code rewrites, no architectural modifications.

---

## Core Capabilities

### 1. Property Valuation
Predict the fair market value of a residential property using a gradient-boosted regression model trained on structural features (area, BHK, floor, age) and locational features (proximity to metro, schools, hospitals, employment hubs).

### 2. Over/Underpricing Detection
Compare the listing price to the predicted fair value and classify the property as overpriced (>10% above), fairly priced (within ±10%), or underpriced (>10% below). Provide a confidence interval.

### 3. Geospatial Intelligence
Query OpenStreetMap via the Overpass API to find nearby schools, hospitals, transit stations, parks, shopping, and other amenities. Compute a composite location score from weighted proximity metrics.

### 4. Personalized Recommendations
Match properties to user preferences (budget, preferred localities, commute destination, BHK preference, lifestyle priorities) using a content-based filtering approach with preference-weighted scoring.

### 5. Property Comparison
Normalize and compare up to 4 properties side-by-side across price, valuation, location score, amenities, investment potential, and suitability.

### 6. Explainable AI
Use SHAP (SHapley Additive exPlanations) to decompose valuation predictions into feature contributions. Translate these into natural-language insights: *"This property is valued 12% above similar properties in the area, primarily because of its proximity to Rajiv Chowk metro (0.8 km) and a newer construction year (2021)."*

### 7. Investment Analysis
Score investment potential based on historical price trends in the locality, upcoming infrastructure (metro expansions, highway projects), rental yield estimates, and demand-supply signals.

### 8. Admin Dashboard
Manage datasets, monitor model versions, review data quality reports, view system metrics, and manage users.

---

## What DataSage Is NOT

- **Not a property listing portal**: DataSage does not compete with MagicBricks, 99acres, or Housing.com. It is an analysis layer that could eventually sit on top of listing data.
- **Not a transaction platform**: No booking, payments, or broker matching.
- **Not a legal/compliance advisor**: No RERA verification, legal due diligence, or document management.
- **Not a real-time market feed**: Predictions are based on historical data, not live auction prices.

---

## Key Constraints

1. **No commercial API access assumed**: We do not claim access to any commercial property portal API. Data sources are limited to publicly available government data (circle rates, DDA records), open datasets, and clearly labeled synthetic seed data.
2. **No fabricated accuracy claims**: ML model performance metrics will only be reported after actual training and evaluation on real or representative data.
3. **No fabricated listings**: All demo/seed data is explicitly labeled as synthetic.
4. **MVP scope is Delhi-NCR only**: The architecture supports expansion, but only Delhi-NCR is in scope for the initial release.
5. **Residential only**: Commercial, industrial, and agricultural properties are out of scope.

---

## Success Metrics (Post-Implementation)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Valuation prediction accuracy | MAPE < 15% on held-out test set | Model evaluation pipeline |
| Over/underpricing detection precision | > 80% on labeled test set | Classification report |
| Location score correlation | Positive correlation with actual transaction prices | Statistical analysis |
| Recommendation relevance | > 70% of recommended properties match user preferences | User feedback / preference overlap |
| API response time (p95) | < 500ms for search, < 2s for valuation | Backend metrics |
| User onboarding completion | > 60% of signups complete preference setup | Analytics |

> **Note**: These are targets, not claims. Actual numbers will be reported after implementation and evaluation.

---

## Related Documents

- [01 — Product Requirements](01-product-requirements.md)
- [02 — User Personas](02-user-personas.md)
- [06 — System Architecture](06-system-architecture.md)
- [28 — MVP vs Future Scope](28-mvp-vs-future-scope.md)
- [29 — Risks & Assumptions](29-risks-and-assumptions.md)
