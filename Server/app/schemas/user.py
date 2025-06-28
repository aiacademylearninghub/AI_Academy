"""Pydantic schemas for user-related data."""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr
    name: str


class UserCreate(UserBase):
    """User creation schema."""

    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """User login schema."""

    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update schema."""

    name: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_image: Optional[str] = None


class ProfileBase(BaseModel):
    """Base profile schema."""

    bio: Optional[str] = None
    learning_interests: Optional[str] = None
    skills: Optional[str] = None


class ProfileCreate(ProfileBase):
    """Profile creation schema."""

    pass


class ProfileUpdate(ProfileBase):
    """Profile update schema."""

    pass


class Profile(ProfileBase):
    """Profile response schema."""

    id: str
    user_id: str

    class Config:
        """Pydantic config."""

        orm_mode = True


class User(UserBase):
    """User response schema."""

    id: str
    profile_image: Optional[str] = None
    is_active: bool

    class Config:
        """Pydantic config."""

        orm_mode = True


class UserWithProfile(User):
    """User with profile response schema."""

    profile: Optional[Profile] = None


class Token(BaseModel):
    """Token response schema."""

    access_token: str
    token_type: str = "bearer"
    expires_at: int
