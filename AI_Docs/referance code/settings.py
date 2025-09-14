# settings.py
from fastapi import APIRouter, Depends, HTTPException, Request, status
from app.security.firebase import get_current_user # Assuming this verifies Firebase token and returns decoded payload
from app.db.firestore import get_firestore_client
# from app.models.user import UserProfile # Assuming this defines the Pydantic model for your user profile
import logging
import smtplib
from email.mime.text import MIMEText
import os
from google.cloud import firestore

router = APIRouter()
logger = logging.getLogger(__name__)

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "aimoney919@gmail.com"
# --- IMPORTANT: Use environment variable for sensitive info ---
# Set this environment variable where you run your FastAPI application:
# export EMAIL_APP_PASSWORD="your_gmail_app_password"
EMAIL_PASSWORD = os.getenv("EMAIL_APP_PASSWORD", 'cplr vvio fnyn uumo')


@router.get("")
async def get_user_profile(current_user=Depends(get_current_user)):
    """
    Retrieves the authenticated user's profile from Firestore.
    Creates a default profile if it doesn't exist.
    `current_user` is the decoded Firebase ID token payload.
    """
    print(f"Backend: GET /settings - Authenticated user UID: {current_user.get('uid')}")
    try:
        uid = current_user.get("uid")
        if not uid:
            # This should ideally be caught by get_current_user, but added for robustness
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token."
            )

        db = get_firestore_client()

        # Firestore path: users/{uid}/profile/profile
        profile_ref = (
            db.collection("users")
            .document(uid)
        )
        profile_doc = profile_ref.get() # Renamed from 'profile' to 'profile_doc' for clarity

        if not profile_doc.exists:
            print(current_user)
            profile_ref.set(current_user)
            logger.info(f"Created default profile for user {uid}")
            return profile_doc.to_dict()

        logger.info(f"Retrieved profile for user {uid}")
        return profile_doc.to_dict()

    except HTTPException: # Re-raise HTTPExceptions as they are intended
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve user profile for UID {current_user.get('uid')}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user profile: {e}"
        )


@router.put("")
async def update_settings(request: Request, current_user=Depends(get_current_user)):
    """
    Updates the authenticated user's profile in Firestore.
    `current_user` is the decoded Firebase ID token payload.
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

        doc_ref = (
            db.collection("users")
            .document(user_id)
        )

        doc_ref.set(update_data, merge=True)
        logger.info(f"Updated profile for user {user_id} with data: {update_data}")
        return {"message": "Profile updated."}
    except Exception as e:
        logger.error(f"Failed to update profile for user {current_user.get('uid')}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user profile: {e}"
        )


@router.post("/family-request")
async def send_family_request(request: Request, authenticated_user=Depends(get_current_user)):
    """
    Sends a family linking request email to a specified recipient.
    `authenticated_user` is the decoded Firebase ID token payload of the sender.
    """
    print(f"Backend: POST /family-request - Authenticated sender UID: {authenticated_user.get('uid')}")

    # Read the request body ONCE
    data = await request.json()
    recipient_email = data.get("email")

    if not recipient_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipient email is required."
        )

    # Prevent user from sending invitation to themselves
    sender_email = authenticated_user.get("email")
    if recipient_email == sender_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot send an invitation to yourself."
        )
    
    # Check recipient mail present in db
    recipient_uid = None
    db = get_firestore_client()
    for doc in db.collection("users").list_documents():
        profile_doc = doc.get()
        print(f"{profile_doc.get('email')=} {recipient_email=}")
        if (recipient_email == profile_doc.get("email")):
            recipient_uid = profile_doc.get("uid")
    
    if recipient_uid is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The provided email id is not registered with this App."
        )

    # Determine sender's name: prioritize Firestore profile, then Firebase displayName, then generic
    db = get_firestore_client()
    sender_uid = authenticated_user["uid"]
    profile_ref = db.collection("users").document(sender_uid).collection("profile").document("profile")
    profile_doc = profile_ref.get()

    sender_name = "A user" # Default sender name
    if profile_doc.exists:
        sender_profile_name = profile_doc.get("name") # Use lowercase 'name' as per UserProfile
        if sender_profile_name:
            sender_name = sender_profile_name
        else: # Fallback to Firebase's display name if profile 'name' is empty
            sender_name = authenticated_user.get("displayName", authenticated_user.get("name", "A user"))
    else:
        # If no profile doc exists, use Firebase's display name
        sender_name = authenticated_user.get("displayName", authenticated_user.get("name", "A user"))

    print(f"Backend: Sending family request to {recipient_email} from {sender_name}")

    try:
        # Create the email content
        subject = "Family Account Link Request"
        # Generate a unique token for the invitation
        # In a production scenario, use a more robust token generation and storage mechanism
        token = os.urandom(16).hex()
        invitation_ref = db.collection("invitations").document(token)
        invitation_ref.set({
            "sender_uid": sender_uid,
            "recipient_uid":recipient_uid,
            "recipient_email": recipient_email,
            "status": "pending"
        })

        # In a production environment, use the frontend URL from a config file
        frontend_url = os.environ['FRONTEND_ORIGIN']
        accept_url = f"{frontend_url}/accept-invitation?recipient_email={recipient_email}&recipient_uid={recipient_uid}&sender_uid={sender_uid}"

        body = (
            f'''
            <html>
            <body>
                <p>{sender_name} has invited you to link family accounts with AIMoney.</p>
                <p>If you accept, your family account will be authenticated and data will be fetched.</p>
                <a href="{accept_url}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Accept Invitation</a>
            </body>
            </html>
            '''
        )
        msg = MIMEText(body, 'html')
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = recipient_email

        # Connect to Gmail's SMTP server using TLS
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30) as server:
            server.set_debuglevel(1)  # Enable debug output for debugging SMTP issues
            server.ehlo()
            server.starttls()
            server.ehlo()

            server.login(SENDER_EMAIL, EMAIL_PASSWORD)

            server.sendmail(SENDER_EMAIL, [recipient_email], msg.as_string())

            return {"message": "Family request email sent successfully."}

    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP Authentication failed. Check SENDER_EMAIL and EMAIL_APP_PASSWORD environment variable.", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to authenticate with email server. Please check credentials."
        )
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error occurred while sending email: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {e}"
        )
    except Exception as e:
        logger.error(f"Unexpected error while sending email: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while sending email."
        )

@router.post("/accept-invitation")
async def accept_invitation(request: Request):
    """
    Accepts a family linking request and creates a family document in Firestore.
    """
    data = await request.json()
    sender_uid_from_client = data.get("sender_uid")
    recipient_email_from_invitation = data.get("recipient_email")
    recipient_uid_from_invitation = data.get("recipient_uid")

    db = get_firestore_client()
    

    family_ref = db.collection("family").document(sender_uid_from_client)

    family_ref.set({
        "members": firestore.ArrayUnion([{"email":recipient_email_from_invitation, "uid":recipient_uid_from_invitation}])
    }, merge=True)


    return {"message": "Family invitation accepted successfully."}


@router.get("/family-members")
async def get_family_members(authenticated_user=Depends(get_current_user)):
    """
    Retrieves the family members of the authenticated user.
    """
    db = get_firestore_client()
    current_user_uid = authenticated_user.get("uid")


    profile = db.collection("users").document(current_user_uid)
    profile_doc = profile.get()
    if profile_doc.exists:
        print(profile_doc.to_dict())
    else:
        print("Nothuing here")

    # Check if the user is a family owner
    family_ref = db.collection("family").document(current_user_uid)
    family_doc = family_ref.get()
    print("FAMILY_DOC",family_doc)


    if family_doc.exists:
        member_emails = family_doc.to_dict().get("members", [])
        print(current_user_uid,member_emails)
        return member_emails

    else:
        return []