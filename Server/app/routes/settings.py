"""Settings routes for the AI Academy application."""

import logging
import os
import smtplib
from email.mime.text import MIMEText
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from firebase_admin import firestore

from app.core.security import get_current_user
from app.db.firestore import get_firestore_client

# Set up logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Email settings - use environment variables in production
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.environ.get("EMAIL_SENDER", "aiacademyhub@gmail.com")
EMAIL_PASSWORD = os.environ.get(
    "EMAIL_PASSWORD", ""
)  # Set in environment variables for security


@router.get("")
async def get_user_profile(current_user=Depends(get_current_user)):
    """
    Retrieves the authenticated user's profile from Firestore.
    Creates a default profile if it doesn't exist.
    """
    print(f"Backend: GET /settings - Authenticated user UID: {current_user.get('uid')}")
    try:
        uid = current_user.get("uid")
        if not uid:
            # This should ideally be caught by get_current_user
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        db = get_firestore_client()

        # Get user profile from Firestore
        profile_ref = db.collection("users").document(uid)
        profile_doc = profile_ref.get()

        if not profile_doc.exists:
            # Create default profile if it doesn't exist
            profile_ref.set(current_user)
            logger.info(f"Created default profile for user {uid}")
            return current_user

        logger.info(f"Retrieved profile for user {uid}")
        return profile_doc.to_dict()

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Failed to retrieve user profile for UID {current_user.get('uid')}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user profile: {e}",
        )


@router.put("")
async def update_settings(request: Request, current_user=Depends(get_current_user)):
    """
    Updates the authenticated user's profile in Firestore.
    """
    print(f"Backend: PUT /settings - Authenticated user UID: {current_user.get('uid')}")
    try:
        data = await request.json()
        db = get_firestore_client()
        user_id = current_user["uid"]

        update_data = {}
        if "name" in data:
            update_data["name"] = data["name"]
        if "email" in data:
            update_data["email"] = data["email"]

        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update.")

        doc_ref = db.collection("users").document(user_id)
        doc_ref.set(update_data, merge=True)
        logger.info(f"Updated profile for user {user_id} with data: {update_data}")
        return {"message": "Profile updated."}
    except Exception as e:
        logger.error(
            f"Failed to update profile for user {current_user.get('uid')}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user profile: {e}",
        )


@router.post("/family-request")
async def send_family_request(
    request: Request, authenticated_user=Depends(get_current_user)
):
    """
    Sends a family linking request email to a specified recipient.
    """
    print(
        f"Backend: POST /family-request - Authenticated sender UID: {authenticated_user.get('uid')}"
    )

    # Read the request body
    data = await request.json()
    recipient_email = data.get("email")

    if not recipient_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipient email is required.",
        )

    # Prevent user from sending invitation to themselves
    sender_email = authenticated_user.get("email")
    if recipient_email == sender_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot send an invitation to yourself.",
        )

    # Check if recipient email exists in database
    recipient_uid = None
    db = get_firestore_client()
    for doc in db.collection("users").list_documents():
        profile_doc = doc.get()
        if recipient_email == profile_doc.get("email"):
            recipient_uid = profile_doc.get("uid")

    if recipient_uid is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The provided email is not registered with AI Academy.",
        )

    # Get sender's name
    sender_uid = authenticated_user["uid"]
    sender_doc = db.collection("users").document(sender_uid).get()

    sender_name = "A user"  # Default name
    if sender_doc.exists:
        sender_profile = sender_doc.to_dict()
        sender_name = sender_profile.get(
            "name", authenticated_user.get("displayName", "A user")
        )

    print(f"Backend: Sending family request to {recipient_email} from {sender_name}")

    try:
        # Generate a token for the invitation
        token = os.urandom(16).hex()
        invitation_ref = db.collection("invitations").document(token)
        invitation_ref.set(
            {
                "sender_uid": sender_uid,
                "recipient_uid": recipient_uid,
                "recipient_email": recipient_email,
                "status": "pending",
                "created_at": firestore.SERVER_TIMESTAMP,
            }
        )

        # Create the accept URL
        frontend_url = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
        accept_url = f"{frontend_url}/accept-invitation?token={token}"

        # Create email body
        body = f"""
        <html>
        <body>
            <p>{sender_name} has invited you to link family accounts with AI Academy.</p>
            <p>If you accept, your family account will be authenticated and data will be shared between accounts.</p>
            <a href="{accept_url}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Accept Invitation</a>
        </body>
        </html>
        """

        msg = MIMEText(body, "html")
        msg["Subject"] = "AI Academy Family Account Link Request"
        msg["From"] = SENDER_EMAIL
        msg["To"] = recipient_email

        # Send email
        if not EMAIL_PASSWORD:
            logger.warning("EMAIL_PASSWORD not set. Email sending skipped.")
            return {
                "message": "Family request processed (email delivery skipped - no password set)"
            }

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, EMAIL_PASSWORD)
            server.sendmail(SENDER_EMAIL, [recipient_email], msg.as_string())

        return {"message": "Family request email sent successfully."}

    except smtplib.SMTPAuthenticationError:
        logger.error(
            "SMTP Authentication failed. Check SENDER_EMAIL and EMAIL_PASSWORD environment variables.",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to authenticate with email server. Please check credentials.",
        )
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error occurred while sending email: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {e}",
        )
    except Exception as e:
        logger.error(f"Unexpected error while sending email: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while sending email.",
        )


@router.post("/accept-invitation")
async def accept_invitation(request: Request):
    """
    Accepts a family linking request and creates a family document in Firestore.
    """
    data = await request.json()
    token = data.get("token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation token is required.",
        )

    db = get_firestore_client()

    # Get the invitation data
    invitation_ref = db.collection("invitations").document(token)
    invitation_doc = invitation_ref.get()

    if not invitation_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found or has expired.",
        )

    invitation_data = invitation_doc.to_dict()

    # Check if already accepted
    if invitation_data.get("status") == "accepted":
        return {"message": "Invitation was already accepted."}

    # Get sender and recipient data
    sender_uid = invitation_data.get("sender_uid")
    recipient_uid = invitation_data.get("recipient_uid")
    recipient_email = invitation_data.get("recipient_email")

    # Create/update family connection for sender
    sender_family_ref = db.collection("family").document(sender_uid)

    # Add recipient to sender's family
    sender_family_ref.set(
        {
            "members": firestore.ArrayUnion(
                [{"email": recipient_email, "uid": recipient_uid}]
            )
        },
        merge=True,
    )

    # Create/update family connection for recipient
    recipient_family_ref = db.collection("family").document(recipient_uid)

    # Get sender's email
    sender_doc = db.collection("users").document(sender_uid).get()
    sender_email = sender_doc.to_dict().get("email", "")

    # Add sender to recipient's family
    recipient_family_ref.set(
        {"members": firestore.ArrayUnion([{"email": sender_email, "uid": sender_uid}])},
        merge=True,
    )

    # Update invitation status
    invitation_ref.update(
        {"status": "accepted", "accepted_at": firestore.SERVER_TIMESTAMP}
    )

    return {"message": "Family invitation accepted successfully."}


@router.get("/family-members")
async def get_family_members(current_user=Depends(get_current_user)):
    """
    Retrieves the family members of the authenticated user.
    """
    db = get_firestore_client()
    current_user_uid = current_user.get("uid")

    if not current_user_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token.",
        )

    # Get family document
    family_ref = db.collection("family").document(current_user_uid)
    family_doc = family_ref.get()

    if family_doc.exists:
        family_data = family_doc.to_dict()
        members = family_data.get("members", [])
        return members
    else:
        return []
