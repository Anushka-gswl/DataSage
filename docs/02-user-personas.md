# 02 — User Personas

## Overview

DataSage serves four distinct user personas with different goals, technical sophistication, and decision-making criteria. Each persona is mapped to the features they use most frequently.

---

## Persona A: Priya — The Home Buyer

### Demographics
- **Age**: 28–40
- **Occupation**: IT professional, mid-level manager, or dual-income household
- **Location**: Currently renting in Delhi-NCR; looking to buy first home
- **Tech comfort**: High — uses apps daily, comfortable with data but not a data analyst
- **Budget**: ₹40 lakh – ₹1.5 crore

### Goals
1. Find a fairly priced 2–3 BHK apartment within budget
2. Ensure the locality has good schools (planning for children), hospitals, and metro connectivity
3. Keep commute to office under 45 minutes
4. Avoid paying more than the property is worth
5. Understand *why* a property is recommended — not just *what*

### Pain Points
- Brokers quote inflated prices and she has no way to verify
- Spent weeks on 99acres/MagicBricks comparing properties manually
- Doesn't know how to evaluate a "good location" beyond anecdotal advice
- Overwhelmed by choice — 500+ listings for "3 BHK Noida" with no personalization
- Doesn't trust opaque "recommendations" with no explanation

### Success Criteria
- Confident the price she pays is within 10% of fair market value
- Can show her spouse a clear comparison of shortlisted properties
- Understands exactly why DataSage recommended a property

### Feature Usage Map
| Feature | Usage Frequency | Importance |
|---------|----------------|-----------|
| Property Search & Filter | Daily | Critical |
| Fair Value Prediction | Per property | Critical |
| Over/Underpricing Badge | Per property | Critical |
| Nearby Amenities (map) | Per property | High |
| Location Score | Per property | High |
| Recommendations | Weekly | High |
| Property Comparison | Weekly | High |
| Explainable AI Insights | Per property | Medium |
| Saved Properties | Ongoing | Medium |
| Investment Score | Occasionally | Low |

### Scenario
> Priya searches for "3 BHK Noida Sector 75–78, ₹50L–₹80L". She gets 12 results. She notices two properties are flagged as "Underpriced by 14%" and "Fairly priced". She opens the underpriced one. The AI analysis shows: predicted value ₹68L, listing price ₹58L, location score 72/100, nearest metro 1.2 km, 3 schools within 2 km. The explanation says: *"This property is priced below comparable properties due to a lower floor (2nd floor) and older construction (2015), but benefits from excellent metro proximity."* She saves it and adds it to her comparison list.

---

## Persona B: Rajesh — The Property Investor

### Demographics
- **Age**: 35–55
- **Occupation**: Business owner, senior executive, or experienced investor
- **Location**: May not live in Delhi-NCR; invests remotely
- **Tech comfort**: Moderate — uses spreadsheets, wants data but not dashboards full of jargon
- **Budget**: ₹80 lakh – ₹5 crore per investment

### Goals
1. Identify underpriced properties with appreciation potential
2. Evaluate investment return (capital appreciation + rental yield)
3. Compare multiple properties on investment metrics
4. Understand infrastructure developments that affect future value
5. Make decisions quickly — evaluates 10+ properties per week

### Pain Points
- Relies on broker network and word-of-mouth for deal flow
- No systematic way to compare investment potential across localities
- Missed opportunities because evaluation takes too long
- Has been burned by overpriced properties in the past
- Wants data, not opinions

### Success Criteria
- Can screen 20 properties in an hour using DataSage data
- Investment score helps prioritize which properties to visit physically
- Accurately identifies at least 3 underpriced properties per month
- Comparable property data eliminates need for manual market research

### Feature Usage Map
| Feature | Usage Frequency | Importance |
|---------|----------------|-----------|
| Over/Underpricing Detection | Per property | Critical |
| Investment Score | Per property | Critical |
| Property Comparison | Weekly | Critical |
| Fair Value Prediction | Per property | Critical |
| Property Search & Filter | Daily | High |
| Location Score | Per property | High |
| Explainable AI Insights | Per property | Medium |
| Recommendations | Weekly | Medium |
| Saved Properties | Ongoing | Medium |
| Nearby Amenities | Occasionally | Low |

### Scenario
> Rajesh filters for "Underpriced properties, Gurgaon, ₹1Cr–₹2Cr, 3 BHK". He sorts by investment score. The top result is in Sector 82: listing ₹1.15Cr, predicted value ₹1.35Cr, investment score 81/100. The breakdown shows: *"Sector 82 prices have grown 8% YoY, new metro line (Dwarka Expressway) within 3 km, rental yield ~3.2%."* He compares it with two other properties in Sector 84 and 89. The comparison table shows Sector 82 has the best price-to-value ratio and highest investment score. He saves all three for a site visit.

---

## Persona C: Amit — The Real Estate Professional

### Demographics
- **Age**: 30–50
- **Occupation**: Real estate broker, property consultant, or analyst at a real estate firm
- **Location**: Based in Delhi-NCR, serves clients across the region
- **Tech comfort**: Moderate — uses WhatsApp, portals, some CRM tools
- **Volume**: Handles 20–50 client inquiries per month

### Goals
1. Provide clients with data-backed property recommendations
2. Justify pricing to skeptical buyers using AI-generated analysis
3. Quickly pull comparable properties for a given listing
4. Differentiate from competitors by offering analytical insights
5. Eventually manage a portfolio of properties with analytics

### Pain Points
- Clients increasingly demand data and transparency
- Compiling comparables manually takes 2–3 hours per client
- No tool gives an independent, unbiased price estimate
- Competing brokers use the same listing portals — no differentiation
- Loses credibility when recommended properties turn out to be overpriced

### Success Criteria
- Can generate a property analysis report for a client in under 10 minutes
- Comparable property data is credible and up-to-date
- AI valuation matches his market intuition within 10% (builds trust in the tool)
- Clients perceive him as data-savvy and trustworthy

### Feature Usage Map
| Feature | Usage Frequency | Importance |
|---------|----------------|-----------|
| Property Search & Filter | Multiple daily | Critical |
| Fair Value Prediction | Per property | Critical |
| Property Comparison | Daily | Critical |
| Over/Underpricing Detection | Per property | High |
| Location Score + Amenities | Per property | High |
| Explainable AI Insights | Per property | High |
| Investment Score | Per property | Medium |
| Saved Properties | Ongoing | Medium |
| Recommendations | Weekly | Low |

### Scenario
> A client calls Amit about a 3 BHK in Vasant Kunj listed at ₹2.1Cr. Amit opens DataSage, pulls up the property. The AI shows: predicted value ₹1.85Cr, overpriced by 13.5%. He shares this with the client: *"The AI estimates fair value at ₹1.85 crore. The premium is mainly because the seller has priced in the balcony area, which comparable properties in D-block don't include."* He pulls up 3 comparable properties in the same sector and sends the client a side-by-side comparison. The client appreciates the transparency.

---

## Persona D: Sneha — The Platform Administrator

### Demographics
- **Age**: 25–35
- **Occupation**: DevOps engineer, data engineer, or platform operations lead
- **Tech comfort**: Very high — command line, SQL, monitoring dashboards
- **Role**: Manages the DataSage platform's data, models, and health

### Goals
1. Ensure data ingestion pipelines run without errors
2. Monitor ML model performance and trigger retraining when metrics degrade
3. Manage user accounts and access control
4. Maintain data quality — catch and quarantine bad data before it reaches users
5. Keep the system healthy — uptime, latency, error rates

### Pain Points
- Data quality issues in source datasets create garbage predictions
- No visibility into model drift until users complain
- Managing dataset versions manually is error-prone
- Debugging user-reported issues requires correlating logs across services

### Success Criteria
- Data quality reports catch 95%+ of bad records before they enter the prediction pipeline
- Model performance dashboards show accuracy trends in real-time
- System uptime > 99.5%
- Can diagnose any user-reported issue within 30 minutes using logs and metrics

### Feature Usage Map
| Feature | Usage Frequency | Importance |
|---------|----------------|-----------|
| Admin Dashboard | Daily | Critical |
| Data Quality Reports | Daily | Critical |
| Dataset Management | Weekly | Critical |
| ML Model Versioning | Weekly | Critical |
| System Health Metrics | Hourly (automated) | Critical |
| User Management | As needed | High |
| Audit Logs | As needed | High |

### Scenario
> Sneha logs into the admin dashboard on Monday morning. She sees the weekly data quality report flagged 47 records from the latest dataset import: 23 have missing area values, 18 have price=0, and 6 have coordinates outside the Delhi-NCR bounding box. She quarantines the batch, fixes the 23 missing areas from the raw source file, drops the invalid records, and re-imports. She then checks the valuation model dashboard: MAPE is 13.2% (within target). She approves the current model version and schedules a retraining for next month when the next circle rate update is published.

---

## Persona–Module Mapping Matrix

| Module | Priya (Buyer) | Rajesh (Investor) | Amit (Professional) | Sneha (Admin) |
|--------|:---:|:---:|:---:|:---:|
| Auth & User Mgmt | ● | ● | ● | ● |
| Onboarding | ● | ● | ○ | — |
| Property Search | ● | ● | ● | — |
| Property Details | ● | ● | ● | — |
| Property Valuation | ● | ● | ● | — |
| Over/Underpricing | ● | ● | ● | — |
| Geospatial Intelligence | ● | ○ | ● | — |
| Recommendation Engine | ● | ● | ○ | — |
| Property Comparison | ● | ● | ● | — |
| Investment Analysis | ○ | ● | ● | — |
| Explainable AI | ● | ● | ● | — |
| Saved Properties | ● | ● | ● | — |
| Search History | ● | ○ | ○ | — |
| Admin Dashboard | — | — | — | ● |
| Dataset Management | — | — | — | ● |
| ML Model Management | — | — | — | ● |
| System Monitoring | — | — | — | ● |

**Legend**: ● = Primary user, ○ = Secondary user, — = Does not use

---

## Related Documents

- [03 — User Flows](03-user-flows.md)
- [04 — Functional Requirements](04-functional-requirements.md)
- [15 — Recommendation Engine](15-recommendation-engine.md)
