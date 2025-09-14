"""User models for database interaction."""

from sqlalchemy import Boolean, Column, String, DateTime
from sqlalchemy.sql import func

from ..db.database import Base


class User(Base):
    """User database model."""

    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    profile_image = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Profile(Base):
    """User profile model."""

    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    bio = Column(String, nullable=True)
    learning_interests = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
