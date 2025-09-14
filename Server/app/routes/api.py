"""API routes for the AI Academy application."""

import logging
from fastapi import APIRouter, Depends, HTTPException, Request, status
from app.db.firestore import get_firestore_client
from app.core.security import get_current_user
from typing import Dict, List, Optional, Any

# Set up logging
logger = logging.getLogger(__name__)

# Create a router
router = APIRouter()

# ==================== COURSES API ====================


@router.get("/courses")
async def get_all_courses(current_user=Depends(get_current_user)):
    """
    Retrieves all courses from Firestore.
    Authentication required.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get Firestore client
        db = get_firestore_client()

        # Get all courses from Firestore
        courses_ref = db.collection("courses")
        courses_docs = courses_ref.stream()

        # Convert to list of dictionaries
        courses = []
        for doc in courses_docs:
            course_data = doc.to_dict()
            course_data["id"] = doc.id  # Add document ID as 'id' field
            courses.append(course_data)

        logger.info(f"Retrieved {len(courses)} courses for user {uid}")
        return courses

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve courses: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve courses: {e}",
        )


@router.get("/courses/{course_id}")
async def get_course(course_id: str, current_user=Depends(get_current_user)):
    """
    Retrieves a specific course by ID from Firestore.
    Authentication required.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get Firestore client
        db = get_firestore_client()

        # Get the course from Firestore
        course_doc = db.collection("courses").document(course_id).get()

        # Check if course exists
        if not course_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID {course_id} not found.",
            )

        # Get course data and add the ID
        course_data = course_doc.to_dict()
        course_data["id"] = course_doc.id

        logger.info(f"Retrieved course {course_id} for user {uid}")
        return course_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve course {course_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve course: {e}",
        )


@router.post("/courses")
async def create_course(request: Request, current_user=Depends(get_current_user)):
    """
    Creates a new course in Firestore.
    Authentication required.
    Admin role check should be added.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get request body
        course_data = await request.json()

        # Validate required fields
        required_fields = ["title", "description", "author", "duration"]
        for field in required_fields:
            if field not in course_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required field: {field}",
                )

        # Add metadata
        course_data["createdBy"] = uid
        course_data["createdAt"] = firestore.SERVER_TIMESTAMP

        # Get Firestore client
        db = get_firestore_client()

        # Create the course in Firestore
        new_course_ref = db.collection("courses").document()
        new_course_ref.set(course_data)

        # Return the created course with its ID
        created_course = course_data
        created_course["id"] = new_course_ref.id

        logger.info(f"Created course {new_course_ref.id} by user {uid}")
        return created_course

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create course: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create course: {e}",
        )


@router.put("/courses/{course_id}")
async def update_course(
    course_id: str, request: Request, current_user=Depends(get_current_user)
):
    """
    Updates an existing course in Firestore.
    Authentication required.
    Admin role or creator check should be added.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get request body
        course_data = await request.json()

        # Get Firestore client
        db = get_firestore_client()

        # Check if course exists
        course_ref = db.collection("courses").document(course_id)
        course_doc = course_ref.get()
        if not course_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID {course_id} not found.",
            )

        # Check ownership (optional, depends on your security model)
        # existing_data = course_doc.to_dict()
        # if existing_data.get("createdBy") != uid:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="You don't have permission to update this course."
        #     )

        # Add update metadata
        course_data["updatedBy"] = uid
        course_data["updatedAt"] = firestore.SERVER_TIMESTAMP

        # Update the course
        course_ref.update(course_data)

        # Return success
        logger.info(f"Updated course {course_id} by user {uid}")
        return {"message": f"Course {course_id} updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update course {course_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update course: {e}",
        )


@router.delete("/courses/{course_id}")
async def delete_course(course_id: str, current_user=Depends(get_current_user)):
    """
    Deletes a course from Firestore.
    Authentication required.
    Admin role or creator check should be added.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get Firestore client
        db = get_firestore_client()

        # Check if course exists
        course_ref = db.collection("courses").document(course_id)
        course_doc = course_ref.get()
        if not course_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID {course_id} not found.",
            )

        # Check ownership (optional, depends on your security model)
        # existing_data = course_doc.to_dict()
        # if existing_data.get("createdBy") != uid:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="You don't have permission to delete this course."
        #     )

        # Delete the course
        course_ref.delete()

        # Return success
        logger.info(f"Deleted course {course_id} by user {uid}")
        return {"message": f"Course {course_id} deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete course {course_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete course: {e}",
        )


# ==================== USER ENROLLMENT API ====================


@router.post("/courses/{course_id}/enroll")
async def enroll_in_course(course_id: str, current_user=Depends(get_current_user)):
    """
    Enrolls the current user in a course.
    Authentication required.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get Firestore client
        db = get_firestore_client()

        # Check if course exists
        course_ref = db.collection("courses").document(course_id)
        course_doc = course_ref.get()
        if not course_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID {course_id} not found.",
            )

        # Check if user is already enrolled
        enrollment_ref = db.collection("enrollments").document(f"{uid}_{course_id}")
        if enrollment_ref.get().exists:
            return {"message": "Already enrolled in this course"}

        # Create enrollment document
        enrollment_data = {
            "userId": uid,
            "courseId": course_id,
            "enrolledAt": firestore.SERVER_TIMESTAMP,
            "progress": 0,  # Initial progress (0%)
            "completed": False,
            "lastAccessed": firestore.SERVER_TIMESTAMP,
        }

        enrollment_ref.set(enrollment_data)

        # Return success
        logger.info(f"User {uid} enrolled in course {course_id}")
        return {"message": f"Successfully enrolled in course {course_id}"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to enroll in course {course_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enroll in course: {e}",
        )


@router.get("/enrollments")
async def get_user_enrollments(current_user=Depends(get_current_user)):
    """
    Gets all courses the user is enrolled in.
    Authentication required.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get Firestore client
        db = get_firestore_client()

        # Query enrollments for the user
        enrollments_query = db.collection("enrollments").where("userId", "==", uid)
        enrollment_docs = enrollments_query.stream()

        # Get course details for each enrollment
        result = []
        for doc in enrollment_docs:
            enrollment_data = doc.to_dict()
            course_id = enrollment_data.get("courseId")

            # Get course details
            course_doc = db.collection("courses").document(course_id).get()
            if course_doc.exists:
                course_data = course_doc.to_dict()
                course_data["id"] = course_doc.id

                # Combine enrollment and course data
                enrollment_with_course = {
                    "enrollmentId": doc.id,
                    "progress": enrollment_data.get("progress", 0),
                    "completed": enrollment_data.get("completed", False),
                    "enrolledAt": enrollment_data.get("enrolledAt"),
                    "lastAccessed": enrollment_data.get("lastAccessed"),
                    "course": course_data,
                }
                result.append(enrollment_with_course)

        logger.info(f"Retrieved {len(result)} enrollments for user {uid}")
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve enrollments: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve enrollments: {e}",
        )


@router.put("/courses/{course_id}/progress")
async def update_course_progress(
    course_id: str, request: Request, current_user=Depends(get_current_user)
):
    """
    Updates the user's progress in a course.
    Authentication required.
    """
    try:
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token.",
            )

        # Get request body
        progress_data = await request.json()
        progress = progress_data.get("progress")
        completed = progress_data.get("completed", False)

        # Validate progress
        if (
            progress is None
            or not isinstance(progress, (int, float))
            or progress < 0
            or progress > 100
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Progress must be a number between 0 and 100.",
            )

        # Get Firestore client
        db = get_firestore_client()

        # Check if enrollment exists
        enrollment_id = f"{uid}_{course_id}"
        enrollment_ref = db.collection("enrollments").document(enrollment_id)
        if not enrollment_ref.get().exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"You are not enrolled in course {course_id}.",
            )

        # Update enrollment progress
        enrollment_ref.update(
            {
                "progress": progress,
                "completed": completed,
                "lastAccessed": firestore.SERVER_TIMESTAMP,
            }
        )

        # Return success
        logger.info(
            f"Updated progress for user {uid} in course {course_id} to {progress}%"
        )
        return {"message": f"Progress updated to {progress}%"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Failed to update progress in course {course_id}: {e}", exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update progress: {e}",
        )


# Import missing dependency
from firebase_admin import firestore
