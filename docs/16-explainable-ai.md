# 16 — Explainable AI

## Overview

DataSage uses SHAP (SHapley Additive exPlanations) to provide transparent, understandable explanations for every property valuation prediction. This document covers the explanation pipeline, natural-language generation, and presentation strategy.

---

## Why Explainability Matters for DataSage

1. **Trust**: Users won't trust a price estimate without understanding why.
2. **Actionability**: "This property is overpriced because of its ground floor" helps the user negotiate.
3. **Differentiation**: Most property portals offer no explanation for their estimates.
4. **Debugging**: Explanations help detect model errors (e.g., model incorrectly values parking).

---

## SHAP: How It Works

SHAP assigns each feature a "contribution" value for a specific prediction:

```
predicted_value = base_value + Σ shap_values[feature_i]
```

Where:
- `base_value` = average model prediction across the training set (the "expected" value)
- `shap_values[feature_i]` = how much feature_i pushes the prediction above or below the base

### Why SHAP (Over Alternatives)

| Method | Pros | Cons | Decision |
|--------|------|------|----------|
| SHAP (TreeSHAP) | Exact for tree models, fast, theoretically grounded | Requires TreeExplainer setup | ✅ **Selected** |
| LIME | Model-agnostic, intuitive | Approximate, unstable, slow | ❌ Unnecessary — TreeSHAP is exact for XGBoost |
| Feature Importance (built-in) | Very fast | Global only — doesn't explain individual predictions | ❌ Insufficient |
| Permutation Importance | Model-agnostic | Slow, global only | ❌ Insufficient |

---

## SHAP Computation Pipeline

```python
# datasage/ml/shap_explainer.py
import shap
import numpy as np

class ShapExplainer:
    def __init__(self, model):
        self.explainer = shap.TreeExplainer(model)
        self.base_value = float(self.explainer.expected_value)

    def explain(self, feature_vector: np.ndarray, feature_names: list[str]) -> dict:
        shap_values = self.explainer.shap_values(feature_vector.reshape(1, -1))
        shap_dict = dict(zip(feature_names, shap_values[0].tolist()))

        # Sort by absolute contribution
        sorted_features = sorted(
            shap_dict.items(),
            key=lambda x: abs(x[1]),
            reverse=True,
        )

        positive = [(k, v) for k, v in sorted_features if v > 0][:3]
        negative = [(k, v) for k, v in sorted_features if v < 0][:3]

        return {
            "base_value": self.base_value,
            "shap_values": shap_dict,
            "top_positive": positive,
            "top_negative": negative,
        }
```

**Performance**: TreeSHAP runs in O(TLD²) where T=trees, L=leaves, D=depth. For XGBoost with 500 trees and max_depth=6, this is ~1ms per prediction. Fast enough for real-time serving.

---

## Natural Language Explanation Generation

### Template-Based Generation

SHAP values are translated to human-readable explanations using templates:

```python
# datasage/services/explainability_service.py
FEATURE_TEMPLATES = {
    "area_sqft_log": {
        "positive": "Larger area ({value} sqft) adds value compared to typical properties",
        "negative": "Smaller area ({value} sqft) reduces value compared to typical properties",
    },
    "metro_distance_km": {
        "positive": "Excellent metro proximity ({value} km)",
        "negative": "Far from nearest metro ({value} km)",
    },
    "property_age": {
        "positive": "Older construction ({value} years) — depreciation factor",
        "negative": "Newer construction ({value} years) — commands premium",
        # Note: inverted — higher age has negative SHAP value
    },
    "floor_ratio": {
        "positive": "Higher floor position increases value",
        "negative": "Lower floor position decreases value",
    },
    "school_distance_km": {
        "positive": "Near good schools ({value} km)",
        "negative": "Far from schools ({value} km)",
    },
    "furnishing_ordinal": {
        "positive": "Furnished/semi-furnished adds value",
        "negative": "Unfurnished — no furniture premium",
    },
    "parking_count": {
        "positive": "{value} parking space(s) — valued in urban areas",
        "negative": "Limited parking reduces appeal",
    },
    "locality_avg_price": {
        "positive": "Located in a premium locality",
        "negative": "Located in a lower-priced locality",
    },
}

def generate_explanation_text(feature_name: str, shap_value: float, feature_value: float) -> str:
    templates = FEATURE_TEMPLATES.get(feature_name)
    if not templates:
        return f"{humanize_feature_name(feature_name)}: {'positive' if shap_value > 0 else 'negative'} impact"

    direction = "positive" if shap_value > 0 else "negative"
    return templates[direction].format(value=format_feature_value(feature_name, feature_value))
```

### Explanation Assembly

```python
def build_explanation(shap_result: dict, feature_values: dict, listing_price: int) -> dict:
    predicted = shap_result["base_value"] + sum(shap_result["shap_values"].values())

    top_positive_factors = [
        {
            "feature": fname,
            "value": feature_values[fname],
            "contribution": f"+₹{abs(contribution)/100000:.1f}L",
            "contribution_raw": contribution,
            "text": generate_explanation_text(fname, contribution, feature_values[fname]),
        }
        for fname, contribution in shap_result["top_positive"]
    ]

    top_negative_factors = [
        {
            "feature": fname,
            "value": feature_values[fname],
            "contribution": f"-₹{abs(contribution)/100000:.1f}L",
            "contribution_raw": contribution,
            "text": generate_explanation_text(fname, contribution, feature_values[fname]),
        }
        for fname, contribution in shap_result["top_negative"]
    ]

    return {
        "top_positive_factors": top_positive_factors,
        "top_negative_factors": top_negative_factors,
        "base_value": shap_result["base_value"],
        "summary": generate_summary(predicted, listing_price, top_positive_factors, top_negative_factors),
    }
```

### Summary Generation

```python
def generate_summary(predicted, listing_price, positives, negatives) -> str:
    gap_pct = ((listing_price - predicted) / predicted) * 100

    if gap_pct > 10:
        price_desc = f"overpriced by {gap_pct:.1f}%"
    elif gap_pct < -10:
        price_desc = f"underpriced by {abs(gap_pct):.1f}%"
    else:
        price_desc = "fairly priced"

    pos_text = positives[0]["text"] if positives else "no standout positive factors"
    neg_text = negatives[0]["text"] if negatives else "no significant weaknesses"

    return (
        f"This property appears {price_desc}. "
        f"Key strength: {pos_text}. "
        f"Key consideration: {neg_text}."
    )
```

### Example Output

```json
{
  "summary": "This property appears underpriced by 13.4%. Key strength: Excellent metro proximity (1.2 km). Key consideration: Lower floor position decreases value.",
  "top_positive_factors": [
    {
      "feature": "metro_distance_km",
      "value": 1.2,
      "contribution": "+₹4.2L",
      "text": "Excellent metro proximity (1.2 km)"
    },
    {
      "feature": "property_age",
      "value": 5,
      "contribution": "+₹2.8L",
      "text": "Newer construction (5 years) — commands premium"
    },
    {
      "feature": "balcony_count",
      "value": 2,
      "contribution": "+₹1.1L",
      "text": "2 balconies add livability value"
    }
  ],
  "top_negative_factors": [
    {
      "feature": "floor_ratio",
      "value": 0.33,
      "contribution": "-₹1.5L",
      "text": "Lower floor position decreases value"
    },
    {
      "feature": "parking_count",
      "value": 1,
      "contribution": "-₹0.8L",
      "text": "Limited parking reduces appeal"
    }
  ]
}
```

---

## Frontend Visualization

### Strengths & Weaknesses Section

Display top positive and negative factors as a simple list with contribution badges:

```
✅ Excellent metro proximity (1.2 km)        +₹4.2L
✅ Newer construction (5 years)               +₹2.8L
✅ 2 balconies add livability                 +₹1.1L

⚠️ Lower floor position                      -₹1.5L
⚠️ Limited parking                           -₹0.8L
```

### SHAP Waterfall Chart (Future)

Interactive Recharts bar chart showing how each feature pushes the prediction from the base value to the final predicted value. This is a future enhancement — MVP shows the text-based list above.

---

## Testing Explainability

| Test | Method |
|------|--------|
| SHAP values sum to prediction | Assert: `base_value + sum(shap_values) ≈ predicted_value` (within floating-point tolerance) |
| Template coverage | Every feature used in the model has a corresponding template |
| Explanation coherence | Positive SHAP → positive template text (and vice versa) |
| Edge cases | All-zero SHAP (very average property), extreme SHAP values |
| Snapshot tests | Fixed property → fixed explanation text (regression detection) |

---

## Related Documents

- [12 — ML System Design](12-ml-system-design.md)
- [13 — Feature Engineering](13-ml-feature-engineering.md)
- [15 — Recommendation Engine](15-recommendation-engine.md)
- [07 — Frontend Architecture](07-frontend-architecture.md)
