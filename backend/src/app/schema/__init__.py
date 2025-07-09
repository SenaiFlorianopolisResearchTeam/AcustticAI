from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: Optional[str] = None
    nickname: Optional[str] = None
    picture: Optional[str] = None
    email_verified: bool = False


class UserCreate(UserBase):
    """Schema for creating a user."""
    auth0_id: str


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    name: Optional[str] = None
    nickname: Optional[str] = None
    picture: Optional[str] = None
    is_active: Optional[bool] = None


class User(UserBase):
    """Schema for user response."""
    id: int
    auth0_id: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserSessionCreate(BaseModel):
    """Schema for creating a user session."""
    user_id: int
    session_token: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    expires_at: datetime
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None


class UserSession(BaseModel):
    """Schema for user session response."""
    id: int
    user_id: int
    session_token: str
    expires_at: datetime
    created_at: datetime
    is_active: bool
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True


class APIKeyCreate(BaseModel):
    """Schema for creating an API key."""
    key_name: str
    expires_at: Optional[datetime] = None
    permissions: Optional[str] = None


class APIKey(BaseModel):
    """Schema for API key response."""
    id: int
    user_id: int
    key_name: str
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime] = None
    last_used: Optional[datetime] = None
    permissions: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Schema for token data."""
    sub: Optional[str] = None
    email: Optional[str] = None
    permissions: list[str] = []