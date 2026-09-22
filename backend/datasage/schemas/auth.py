"""Authentication request/response schemas."""

from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """User registration payload."""

    name: str = Field(..., min_length=1, max_length=100, examples=["Priya Sharma"])
    email: EmailStr = Field(..., examples=["priya@example.com"])
    password: str = Field(..., min_length=8, max_length=128, examples=["SecurePass1"])


class LoginRequest(BaseModel):
    """Login payload."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token pair response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token TTL in seconds")


class AuthResponse(BaseModel):
    """Full auth response with user info + tokens."""

    id: str
    name: str
    email: str
    role: str
    email_verified: bool
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    """Token refresh payload."""

    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Password reset request (step 1: send email)."""

    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation (step 2: set new password)."""

    token: str
    new_password: str = Field(..., min_length=8, max_length=128)
