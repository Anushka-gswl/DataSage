# 13 — ML Feature Engineering

## Overview

This document defines the complete feature catalog for the valuation model, encoding strategies, feature construction logic, and the feature store design.

---

## Feature Categories

### 1. Structural Features (from property record)

| Feature | Type | Source Column | Encoding | Rationale |
|---------|------|-------------|----------|-----------|
| `area_sqft` | Continuous | `property.area_sqft` | Raw (log-transformed) | Primary price driver. Log-transform for skewed distribution. |
| `bhk` | Ordinal | `property.bhk` | Integer as-is | BHK is ordinal (1 < 2 < 3 < 4). |
| `floor_ratio` | Derived | `floor_number / total_floors` | Float 0–1 | Higher floors command premium. Ratio normalizes across building heights. |
| `is_ground_floor` | Binary | `floor_number == 0 or 1` | 0/1 | Ground floor has distinct pricing pattern (positive in houses, negative in apartments). |
| `is_top_floor` | Binary | `floor_number == total_floors` | 0/1 | Top floor has distinct pricing pattern (positive for penthouse, negative for roof heat). |
| `property_age` | Derived | `current_year - construction_year` | Integer | Older properties depreciate. Newer ones command premium. |
| `property_type` | Categorical | `property.property_type` | One-hot encoding | Apartment, builder_floor, house, plot have different price dynamics. |
| `facing` | Categorical | `property.facing` | One-hot encoding | East/south-facing command premium in India (sunlight, vastu). |
| `furnishing` | Ordinal | `property.furnishing` | Ordinal encoding: unfurnished=0, semi=1, fully=2 | Furnished properties are priced higher. |
| `parking_count` | Discrete | `property.parking_count` | Integer as-is | Parking adds value, especially in urban Delhi-NCR. |
| `balcony_count` | Discrete | `property.balcony_count` | Integer as-is | |
| `bathroom_count` | Discrete | `property.bathroom_count` | Integer as-is | |
| `price_per_sqft_locality_avg` | Derived | `locality.avg_price_per_sqft` | Float | Locality baseline. Anchors prediction to local market. |

### 2. Locational Features (from geospatial analysis)

| Feature | Type | Source | Encoding | Rationale |
|---------|------|--------|----------|-----------|
| `metro_distance_km` | Continuous | Nearest metro station distance | Float | Metro proximity is the #1 location value driver in Delhi-NCR. |
| `metro_count_5km` | Discrete | Count of metro stations within 5 km | Integer | Multiple metro lines = better connectivity. |
| `school_distance_km` | Continuous | Nearest school distance | Float | School proximity drives family buyer demand. |
| `school_count_2km` | Discrete | Count of schools within 2 km | Integer | |
| `hospital_distance_km` | Continuous | Nearest hospital distance | Float | |
| `hospital_count_3km` | Discrete | Count of hospitals within 3 km | Integer | |
| `park_distance_km` | Continuous | Nearest park distance | Float | |
| `shopping_distance_km` | Continuous | Nearest shopping area distance | Float | |
| `bus_stop_count_1km` | Discrete | Count of bus stops within 1 km | Integer | Public transit accessibility. |
| `location_score` | Composite | Computed from above | Float 0–100 | Aggregate location quality. |

### 3. Locality Context Features

| Feature | Type | Source | Encoding | Rationale |
|---------|------|--------|----------|-----------|
| `locality_avg_price` | Continuous | `locality.avg_price_per_sqft` | Float | Market context for the area. |
| `locality_price_trend_1y` | Continuous | `locality.price_trend_1y_pct` | Float (%) | Appreciation trend signal. |
| `city_id` | Categorical | `property.city_id` | One-hot encoding | City-level market differences. |

### 4. Temporal Features

| Feature | Type | Source | Encoding | Rationale |
|---------|------|--------|----------|-----------|
| `listing_month` | Cyclical | `property.listed_at` | sin/cos encoding | Seasonal pricing patterns (festival season, financial year end). |
| `listing_quarter` | Ordinal | Derived from listed_at | Integer 1–4 | Quarterly market cycles. |

---

## Feature Engineering Pipeline

```python
# datasage/ml/feature_builder.py
import numpy as np
from datasage.models.property import Property
from datasage.models.location import PropertyLocation

class FeatureBuilder:
    """Constructs feature vector from property and location data."""

    REQUIRED_FIELDS = ['area_sqft', 'bhk', 'locality_id']
    FEATURE_ORDER = [...]  # Fixed ordering matching training

    def build(self, property: Property, location: PropertyLocation, pois: dict) -> np.ndarray:
        features = {}

        # Structural
        features['area_sqft_log'] = np.log1p(property.area_sqft)
        features['bhk'] = property.bhk
        features['floor_ratio'] = self._floor_ratio(property)
        features['is_ground_floor'] = int(property.floor_number in (0, 1)) if property.floor_number else 0
        features['is_top_floor'] = int(property.floor_number == property.total_floors) if property.floor_number and property.total_floors else 0
        features['property_age'] = self._property_age(property)
        features.update(self._encode_property_type(property.property_type))
        features.update(self._encode_facing(property.facing))
        features['furnishing_ordinal'] = self._encode_furnishing(property.furnishing)
        features['parking_count'] = property.parking_count or 0
        features['balcony_count'] = property.balcony_count or 0
        features['bathroom_count'] = property.bathroom_count or 0

        # Locational
        features.update(self._poi_features(pois))

        # Locality context
        features['locality_avg_price'] = property.locality.avg_price_per_sqft or 0
        features['locality_price_trend_1y'] = property.locality.price_trend_1y_pct or 0

        # Temporal
        features.update(self._temporal_features(property.listed_at))

        return self._to_vector(features)

    def validate(self, property: Property) -> list[str]:
        """Return list of missing required fields."""
        missing = []
        if not property.area_sqft:
            missing.append('area_sqft')
        if not property.bhk:
            missing.append('bhk')
        if not property.locality_id:
            missing.append('locality')
        return missing

    def _floor_ratio(self, p):
        if p.floor_number is not None and p.total_floors and p.total_floors > 0:
            return p.floor_number / p.total_floors
        return 0.5  # Default to mid-floor if unknown

    def _property_age(self, p):
        if p.construction_year:
            return datetime.now().year - p.construction_year
        return 10  # Default median age

    def _encode_property_type(self, pt):
        types = ['apartment', 'builder_floor', 'house', 'plot']
        return {f'type_{t}': int(pt == t) for t in types}

    def _encode_facing(self, f):
        facings = ['north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west']
        return {f'facing_{d}': int(f == d) for d in facings}

    def _encode_furnishing(self, f):
        mapping = {'unfurnished': 0, 'semi_furnished': 1, 'fully_furnished': 2}
        return mapping.get(f, 0)

    def _poi_features(self, pois: dict) -> dict:
        """Extract distance and count features from nearby POI data."""
        features = {}
        categories = {
            'metro': {'distance_key': 'metro_distance_km', 'count_key': 'metro_count_5km', 'radius': 5000},
            'school': {'distance_key': 'school_distance_km', 'count_key': 'school_count_2km', 'radius': 2000},
            'hospital': {'distance_key': 'hospital_distance_km', 'count_key': 'hospital_count_3km', 'radius': 3000},
            'park': {'distance_key': 'park_distance_km', 'count_key': 'park_count_2km', 'radius': 2000},
            'shopping': {'distance_key': 'shopping_distance_km', 'count_key': 'shopping_count_3km', 'radius': 3000},
            'bus_stop': {'distance_key': 'bus_distance_km', 'count_key': 'bus_count_1km', 'radius': 1000},
        }
        for cat, config in categories.items():
            cat_pois = pois.get(cat, [])
            if cat_pois:
                nearest = min(p['distance_m'] for p in cat_pois)
                features[config['distance_key']] = nearest / 1000
                features[config['count_key']] = sum(1 for p in cat_pois if p['distance_m'] <= config['radius'])
            else:
                features[config['distance_key']] = 10.0  # Default: far
                features[config['count_key']] = 0
        return features
```

---

## Missing Value Strategy

| Feature | Missing Rate (Expected) | Strategy | Default Value |
|---------|------------------------|----------|---------------|
| area_sqft | < 1% (required) | Block prediction | N/A |
| bhk | < 1% (required) | Block prediction | N/A |
| floor_number | ~20% | Impute with median (0.5 floor_ratio) | 0.5 |
| total_floors | ~20% | Impute with median | N/A (floor_ratio defaults to 0.5) |
| construction_year | ~30% | Impute with locality median age | 10 years |
| facing | ~40% | Impute with mode or treat as "unknown" category | One-hot: all zeros |
| furnishing | ~25% | Impute as "unfurnished" (most common) | 0 |
| parking_count | ~15% | Default to 0 | 0 |
| POI distances | < 5% (cached) | Default to large distance (10 km) | 10.0 |

**XGBoost advantage**: XGBoost natively handles NaN values by learning optimal split directions. For most features, we can pass NaN directly instead of imputing, letting the model learn the best handling.

---

## Feature Importance (Expected)

Based on real estate domain knowledge and prior studies, the expected feature importance ranking:

| Rank | Feature | Expected Impact | Rationale |
|------|---------|----------------|-----------|
| 1 | area_sqft | Very high | Primary size determinant |
| 2 | locality_avg_price | Very high | Location is the dominant price factor |
| 3 | bhk | High | Configuration drives pricing tier |
| 4 | metro_distance_km | High | Delhi-NCR specific — metro proximity is highly valued |
| 5 | property_age | High | Newer properties command significant premium |
| 6 | floor_ratio | Medium | Higher floors = more premium |
| 7 | furnishing | Medium | Fully furnished adds 10–20% |
| 8 | school_distance_km | Medium | Family-oriented demand |
| 9 | parking_count | Medium | Parking is scarce in urban areas |
| 10 | property_type | Medium | Apartment vs. builder floor pricing |

> **Note**: Actual feature importance will be determined by SHAP analysis after model training. This is domain-knowledge expectation only.

---

## Feature Store (MVP)

For MVP, features are computed on-the-fly during prediction:

1. Fetch property record from PostgreSQL
2. Fetch property location + nearby POIs from PostgreSQL
3. Build feature vector in memory
4. Cache the prediction result (not the feature vector)

### Future: Offline Feature Store

When data volume or prediction latency requires it:
- Precompute and store feature vectors in a `property_features` table
- Update features on property data change or POI refresh
- Prediction becomes: fetch features → model.predict (no feature computation)

---

## Related Documents

- [12 — ML System Design](12-ml-system-design.md)
- [14 — Geospatial System](14-geospatial-system.md)
- [16 — Explainable AI](16-explainable-ai.md)
- [09 — Database Design](09-database-design.md)
