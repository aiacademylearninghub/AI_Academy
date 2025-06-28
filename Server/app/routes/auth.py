"""Authentication endpoints."""

import uuid
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_DAYS,
)
from ..db.database import get_db
from ..models.user import User, Profile
from ..schemas.user import UserCreate, Token, User as UserSchema

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Any:
    """OAuth2 compatible token login, get an access token for future requests."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    # Create access token with expiry date
    expires_delta = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(subject=user.id, expires_delta=expires_delta)
    expires_at = (datetime.utcnow() + expires_delta).timestamp()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": int(expires_at),
    }


@router.post("/signup", response_model=Token)
async def create_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """Create new user."""
    # Check if user with this email exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    # Create user ID
    user_id = str(uuid.uuid4())

    # Create avatar URL
    avatar_url = f"https://ui-avatars.com/api/?name={user_in.name.replace(' ', '+')}&background=6366F1&color=fff"

    # Create user
    user = User(
        id=user_id,
        email=user_in.email,
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
        profile_image=avatar_url,
    )

    # Create profile
    profile = Profile(
        id=str(uuid.uuid4()),
        user_id=user_id,
    )

    db.add(user)
    db.add(profile)
    db.commit()

    # Create access token
    expires_delta = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(subject=user_id, expires_delta=expires_delta)
    expires_at = (datetime.utcnow() + expires_delta).timestamp()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": int(expires_at),
    }
