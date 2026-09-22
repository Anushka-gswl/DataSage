"""Valuation API endpoints — AI price prediction."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from datasage.api.deps import get_current_user, require_role
from datasage.core.database import get_session
from datasage.models.user import User
from datasage.services.valuation_service import ValuationService

router = APIRouter()


@router.get("/{property_id}")
async def get_valuation(
    property_id: str,
    session=Depends(get_session),
):
    """Get AI valuation for a specific property."""
    service = ValuationService(session)
    return await service.predict_value(property_id)


@router.post("/bulk")
async def bulk_valuations(
    limit: int = Query(100, ge=1, le=500),
    user: User = Depends(require_role("admin")),
    session=Depends(get_session),
):
    """Generate valuations for all unvalued properties (admin only)."""
    service = ValuationService(session)
    predictions = await service.bulk_predict(limit=limit)
    return {"generated": len(predictions), "predictions": predictions}
