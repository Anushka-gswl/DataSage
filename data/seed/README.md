# DataSage — Seed Data

## ⚠️ Synthetic Data Notice

**All data in this directory is synthetically generated for development and demonstration purposes only.** It does not represent real property listings, real prices, or real market conditions.

## Data Files

### `localities.csv`

50 localities across Delhi-NCR cities with:

| Column | Description |
|--------|-------------|
| id | Auto-increment locality ID |
| city_id | FK to city table (1=Noida, 2=Gurgaon, 3=Delhi, 4=Ghaziabad, 5=Greater Noida, 6=Faridabad) |
| name | Locality name |
| slug | URL-safe slug |
| centroid_lat | Latitude of locality center (approximate) |
| centroid_lng | Longitude of locality center (approximate) |
| avg_price_per_sqft | Average price per sq ft in INR (synthetic estimate) |
| price_trend_1y_pct | 1-year price trend % (synthetic) |
| price_trend_3y_pct | 3-year price trend % (synthetic) |

### Cities

| ID | City | State |
|----|------|-------|
| 1 | Noida | Uttar Pradesh |
| 2 | Gurgaon | Haryana |
| 3 | New Delhi | Delhi |
| 4 | Ghaziabad | Uttar Pradesh |
| 5 | Greater Noida | Uttar Pradesh |
| 6 | Faridabad | Haryana |

## Usage

```bash
# Load seed data into the database
docker compose exec backend python -m datasage.cli seed --demo
```
