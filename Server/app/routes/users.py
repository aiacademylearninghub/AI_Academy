"""User profile endpoints."""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.auth import get_current_active_user
from ..db.database import get_db
from ..models.user import User, Profile
from ..schemas.user import (
    UserUpdate,
    ProfileUpdate,
    UserWithProfile,
    User as UserSchema,
)

router = APIRouter()


@router.get("/me", response_model=UserWithProfile)
async def read_user_me(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Get current user profile."""
    # Get profile data
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()

    # Create response
    user_dict = {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "profile_image": current_user.profile_image,
        "is_active": current_user.is_active,
    }

    if profile:
        profile_dict = {
            "id": profile.id,
            "user_id": profile.user_id,
            "bio": profile.bio,
            "learning_interests": profile.learning_interests,
            "skills": profile.skills,
        }
        user_dict["profile"] = profile_dict

    return user_dict


@router.put("/me", response_model=UserSchema)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Update current user."""
    # Update fields that were provided
    if user_update.name is not None:
        current_user.name = user_update.name

    if user_update.email is not None:
        # Check if email is taken
        if user_update.email != current_user.email:
            existing_user = (
                db.query(User).filter(User.email == user_update.email).first()
            )
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email

    if user_update.profile_image is not None:
        current_user.profile_image = user_update.profile_image

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user


@router.put("/me/profile", response_model=UserWithProfile)
async def update_user_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Update user profile."""
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()

    # Create profile if it doesn't exist
    if not profile:
        profile = Profile(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
        )

    # Update fields that were provided
    if profile_update.bio is not None:
        profile.bio = profile_update.bio

    if profile_update.learning_interests is not None:
        profile.learning_interests = profile_update.learning_interests

    if profile_update.skills is not None:
        profile.skills = profile_update.skills

    db.add(profile)
    db.commit()
    db.refresh(profile)

    # Create response
    user_dict = {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "profile_image": current_user.profile_image,
        "is_active": current_user.is_active,
        "profile": {
            "id": profile.id,
            "user_id": profile.user_id,
            "bio": profile.bio,
            "learning_interests": profile.learning_interests,
            "skills": profile.skills,
        },
    }

    return user_dict
