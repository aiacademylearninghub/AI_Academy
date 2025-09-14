import os
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.abspath(
    os.path.join(BASE_DIR, "..", "..", "ai-academy-firebase.json")
)

# Your default Firebase Storage bucket name.
STORAGE_BUCKET = "aiacademyhub.firebasestorage.app"
FIRESTORE_DATABASE_ID = "ai-academy"

try:
    cred = credentials.Certificate(json_path)
    firebase_app = firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": FIRESTORE_DATABASE_ID  # This sets the default bucket for storage operations
        },
    )
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    exit()


def get_firebase_app():
    # --- Initialize the Firebase Admin SDK ---
    return cred


def get_firestore_client():
    try:
        db = firestore.client(database_id=FIRESTORE_DATABASE_ID)
    except Exception as e:
        print(f"Error connecting to Firestore or performing operations: {e}")
    return db


def get_storage_bucket():
    try:
        bucket = storage.bucket()
    except Exception as e:
        print(f"Error connecting to Storage or performing operations: {e}")
    return bucket
