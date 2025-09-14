"""Security utilities for authentication."""

import os
import logging
from typing import Optional, Union, Any, Dict
from datetime import datetime, timedelta

# Firebase imports
import firebase_admin
from firebase_admin import auth

# FastAPI imports
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# JWT libraries for backward compatibility if needed
from jose import jwt
from passlib.context import CryptContext
from pydantic import ValidationError

# Set up logging
logger = logging.getLogger(__name__)

# Legacy JWT configuration - kept for backward compatibility
SECRET_KEY = os.environ.get("SECRET_KEY", "ai_academy_dev_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 14
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Set up Bearer token security for Firebase
security = HTTPBearer()


# Firebase Auth functions
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> Dict[str, any]:
    """
    Validate Firebase ID token from the authorization header.
    Returns the decoded Firebase token if valid.
    Raises HTTPException if token is invalid.
    """
    try:
        # Extract token
        token = credentials.credentials

        # Verify Firebase ID token
        decoded_token = auth.verify_id_token(token)

        logger.debug(f"Authenticated user: {decoded_token.get('uid')}")
        return decoded_token
    except auth.InvalidIdTokenError:
        logger.warning("Invalid Firebase ID token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.ExpiredIdTokenError:
        logger.warning("Firebase ID token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.RevokedIdTokenError:
        logger.warning("Firebase ID token has been revoked")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_admin(decoded_token: Dict[str, any]) -> bool:
    """
    Verify if the user has admin privileges.
    Return True if the user is an admin, False otherwise.
    """
    # Check if the user has an admin claim
    # This depends on your Firebase Admin implementation
    # You might have custom claims set for user roles
    return decoded_token.get("admin", False)


async def get_admin_user(current_user: Dict[str, any] = Depends(get_current_user)):
    """
    Ensure the current user has admin privileges.
    Raises HTTPException if the user is not an admin.
    """
    if not verify_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return current_user


# Legacy JWT functions - kept for backward compatibility if needed
def verify_password(plain_password, hashed_password):
    """Verify password against stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hash a password for storage."""
    return pwd_context.hash(password)


def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """Create a JWT token for a user."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except (jwt.JWTError, ValidationError):
        return None
