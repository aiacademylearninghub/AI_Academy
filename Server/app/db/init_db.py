"""Database initialization."""

from ..db.database import engine
from ..models import user


def init_db():
    """Initialize database tables."""
    # Create tables
    user.Base.metadata.create_all(bind=engine)
