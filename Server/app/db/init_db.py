"""Database initialization."""

import logging

# Set up logging
logger = logging.getLogger(__name__)


def init_db():
    """
    Initialize database tables and Firestore collections.
    This function is called during application startup.
    """
    try:
        # Initialize SQLite database if used
        try:
            from ..db.database import engine
            from ..models import user

            # Create tables in SQLite
            user.Base.metadata.create_all(bind=engine)
            logger.info("SQLite database tables initialized")
        except (ImportError, AttributeError, Exception) as e:
            logger.warning(f"SQLite database initialization skipped: {e}")

        # Initialize Firestore collections
        try:
            from app.db.firestore import get_firestore_client

            # Get Firestore client
            db = get_firestore_client()

            # Check required collections existence
            required_collections = [
                "users",
                "courses",
                "enrollments",
                "family",
                "invitations",
            ]

            existing_collections = [collection.id for collection in db.collections()]

            # Log initialization status
            logger.info(
                f"Firestore initialized with collections: {existing_collections}"
            )

            # Note: Firestore collections are created automatically when documents are added
            # so we don't need to explicitly create them
        except Exception as e:
            logger.warning(f"Firestore initialization skipped: {e}")

        return True
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}", exc_info=True)
        return False
