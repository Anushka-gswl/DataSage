"""Model registry — import all models so Alembic can auto-detect them."""

from datasage.models.base import Base  # noqa: F401
from datasage.models.reference import City, Locality  # noqa: F401
from datasage.models.user import User, UserPreference  # noqa: F401
from datasage.models.property import Property, PropertyImage  # noqa: F401
from datasage.models.location import PropertyLocation, POI, NearbyPOI  # noqa: F401
from datasage.models.valuation import ValuationPrediction, ModelVersion  # noqa: F401
from datasage.models.interaction import SavedProperty, SearchHistory  # noqa: F401
from datasage.models.recommendation import Recommendation, RecommendationReason  # noqa: F401
from datasage.models.admin import Dataset, DatasetImport, DataQualityReport  # noqa: F401
from datasage.models.audit import AuditLog  # noqa: F401
