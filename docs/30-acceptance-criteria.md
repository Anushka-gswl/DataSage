# 30 — Acceptance Criteria

## Overview

This document defines acceptance criteria for each MVP module using Given/When/Then format. These criteria serve as the definition of "done" for each feature.

---

## Module: Authentication

### AC-AUTH-01: User Registration
```
Given: A visitor on the registration page
When: They submit a valid name, email, and password
Then: An account is created with role "buyer"
  And: They receive JWT access and refresh tokens
  And: They are redirected to the onboarding page
```

### AC-AUTH-02: Login
```
Given: A registered user on the login page
When: They submit correct email and password
Then: They receive new JWT tokens
  And: last_login_at is updated
  And: They are redirected to the dashboard
```

### AC-AUTH-03: Invalid Login
```
Given: A visitor on the login page
When: They submit incorrect credentials
Then: They see "Invalid email or password"
  And: A failed login attempt is recorded
  And: No tokens are issued
```

### AC-AUTH-04: Account Lockout
```
Given: A user who has failed login 5 times consecutively
When: They attempt a 6th login
Then: They see "Account locked. Try again in 15 minutes"
  And: The account is locked for 15 minutes
  And: Password reset is still available
```

### AC-AUTH-05: Token Refresh
```
Given: A logged-in user whose access token has expired
When: The frontend sends the refresh token to /auth/refresh
Then: A new access token and refresh token are returned
  And: The old refresh token is invalidated
```

---

## Module: Property Search

### AC-SEARCH-01: Basic Search
```
Given: A user on the search page
When: They select a locality from the autocomplete
Then: Properties in that locality are displayed as cards
  And: Each card shows: title, price, BHK, area, pricing badge, location score
  And: Results are paginated (20 per page)
```

### AC-SEARCH-02: Filtered Search
```
Given: A user on the search page
When: They set filters (price: ₹40L–₹80L, BHK: 3, type: apartment)
Then: Only properties matching ALL filters are shown
  And: Result count is displayed
  And: Filters are reflected in the URL query string
```

### AC-SEARCH-03: Empty Results
```
Given: A user searching for properties
When: No properties match their criteria
Then: They see "No properties found matching your filters"
  And: Nearby localities are suggested
  And: A "Clear filters" button is available
```

### AC-SEARCH-04: Sorting
```
Given: Search results are displayed
When: The user selects "Price: Low to High"
Then: Results are re-ordered by listing price ascending
  And: The sort selection persists across pagination
```

---

## Module: Property Valuation

### AC-VAL-01: Fair Value Prediction
```
Given: A property with all required features (area, BHK, locality, coordinates)
When: The property detail page loads
Then: The predicted fair value is displayed with a confidence interval
  And: The model version is recorded
  And: The prediction is cached for 24 hours
```

### AC-VAL-02: Pricing Classification
```
Given: A property with a listing price and predicted value
When: The price gap is calculated
Then: If gap > +10%: badge shows "Overpriced by X%" (red)
  And: If gap between -10% and +10%: badge shows "Fairly Priced" (blue)
  And: If gap < -10%: badge shows "Underpriced by X%" (green)
  And: The exact percentage and absolute difference are shown
```

### AC-VAL-03: Insufficient Data
```
Given: A property missing required features (e.g., no area_sqft)
When: The valuation endpoint is called
Then: HTTP 422 is returned with "Missing: area_sqft"
  And: The property detail page shows "AI valuation unavailable — insufficient data"
```

---

## Module: Geospatial Intelligence

### AC-GEO-01: Nearby POIs
```
Given: A property with valid coordinates
When: The property detail page loads
Then: Nearby POIs (schools, hospitals, metro, parks, shopping) are displayed on an interactive map
  And: POIs are categorized by icon and color
  And: Distance to each POI is shown in meters/km
```

### AC-GEO-02: Location Score
```
Given: A property with nearby POIs computed
When: The location section renders
Then: A composite score (0–100) is displayed
  And: Sub-scores per category are visible
  And: The nearest POI per category is highlighted
```

---

## Module: Recommendation Engine

### AC-REC-01: Personalized Recommendations
```
Given: A logged-in user with preferences set (budget, BHK, localities)
When: They visit the dashboard
Then: Up to 10 recommended properties are shown, ranked by suitability score
  And: Each recommendation includes 2–4 natural-language reasons
  And: Reasons reference the user's specific preferences
```

### AC-REC-02: Cold Start
```
Given: A new user who skipped onboarding
When: They visit the dashboard
Then: They see popular properties in Delhi-NCR
  And: A banner says "Set your preferences for personalized recommendations"
```

### AC-REC-03: No Matches
```
Given: A user whose preferences are very restrictive
When: No properties match all criteria
Then: They see "No exact matches found"
  And: The 5 closest matches are shown with notes on which criteria were relaxed
```

---

## Module: Property Comparison

### AC-CMP-01: Add to Comparison
```
Given: A user viewing search results or a property detail page
When: They click "Add to Compare"
Then: The property is added to the comparison list
  And: A toast confirms the addition
  And: The comparison count is visible in the header (e.g., "Compare (2)")
```

### AC-CMP-02: Comparison Table
```
Given: A user has selected 2–4 properties for comparison
When: They click "Compare"
Then: A side-by-side table shows all properties with metrics:
  price, predicted value, price gap, location score, BHK, area, investment score
  And: The best value per metric is highlighted (green)
  And: The worst value per metric is highlighted (red)
```

### AC-CMP-03: Maximum Reached
```
Given: A user has 4 properties in the comparison list
When: They try to add a 5th
Then: They see "Maximum 4 properties. Remove one to add another."
  And: The 5th property is NOT added
```

---

## Module: Explainable AI

### AC-XAI-01: Strengths and Weaknesses
```
Given: A property with a valuation prediction
When: The AI analysis section renders
Then: Top 3 positive factors are shown with contribution amounts (+₹X.XL)
  And: Top 3 negative factors are shown with contribution amounts (-₹X.XL)
  And: Each factor has a human-readable explanation
```

### AC-XAI-02: Explanation Coherence
```
Given: SHAP values are computed for a property
When: Explanations are generated
Then: Positive SHAP values map to positive/strength language
  And: Negative SHAP values map to negative/weakness language
  And: No explanation contradicts the SHAP direction
```

---

## Module: Admin Dashboard

### AC-ADMIN-01: Dataset Upload
```
Given: An admin on the dataset management page
When: They upload a valid CSV file
Then: The system processes the file in the background
  And: A summary shows: total rows, valid rows, quarantined rows
  And: A data quality report is generated
```

### AC-ADMIN-02: Model Management
```
Given: An admin on the model management page
When: They view the model list
Then: All trained model versions are shown with metrics (MAPE, R², MAE)
  And: The currently active model is highlighted
  And: They can promote a different version to active
```

---

## Definition of Done (Global)

A feature is "done" when:
- [ ] All acceptance criteria pass
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (if applicable)
- [ ] API endpoint documented (auto-generated Swagger)
- [ ] Frontend component renders correctly on desktop and mobile
- [ ] Error states handled (validation, empty, unauthorized, server error)
- [ ] Loading states implemented (skeleton UI)
- [ ] No lint warnings (ruff, eslint)
- [ ] No type errors (mypy, tsc)
- [ ] Code reviewed
- [ ] Documented in relevant .md file (if architectural impact)

---

## Related Documents

- [04 — Functional Requirements](04-functional-requirements.md)
- [23 — Testing Strategy](23-testing-strategy.md)
- [03 — User Flows](03-user-flows.md)
