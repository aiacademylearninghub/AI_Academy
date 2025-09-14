"""
Initialize Firestore with sample course data.

This script creates sample courses in Firestore to populate the database.
Run this script once to set up initial data for testing the application.
"""

import os
import firebase_admin
from firebase_admin import credentials, firestore
import json
import datetime

# Path to the Firebase service account key file
json_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "aiacademyhub-firebase.json")
)

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate(json_path)
    firebase_app = firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    exit(1)

# Get Firestore client
db = firestore.client()

# Sample course data
sample_courses = [
    {
        "title": "Introduction to AI and Machine Learning",
        "description": "Learn the fundamentals of AI and machine learning concepts, algorithms, and applications.",
        "author": "Dr. Alan Turing",
        "duration": 120,  # minutes
        "level": "Beginner",
        "topics": ["AI", "Machine Learning", "Data Science"],
        "imageUrl": "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        "createdAt": firestore.SERVER_TIMESTAMP,
    },
    {
        "title": "Python for Data Science",
        "description": "Master Python programming for data analysis, visualization, and machine learning.",
        "author": "Grace Harper",
        "duration": 180,
        "level": "Intermediate",
        "topics": ["Python", "Data Analysis", "Visualization"],
        "imageUrl": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
        "createdAt": firestore.SERVER_TIMESTAMP,
    },
    {
        "title": "Deep Learning with TensorFlow",
        "description": "Build and train neural networks using TensorFlow for various AI applications.",
        "author": "Dr. Alan Turing",
        "duration": 240,
        "level": "Advanced",
        "topics": ["Deep Learning", "TensorFlow", "Neural Networks"],
        "imageUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "createdAt": firestore.SERVER_TIMESTAMP,
    },
    {
        "title": "Natural Language Processing Fundamentals",
        "description": "Understand the principles and techniques behind processing and analyzing human language.",
        "author": "Ada Lovelace",
        "duration": 150,
        "level": "Intermediate",
        "topics": ["NLP", "Text Analysis", "Language Models"],
        "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475",
        "createdAt": firestore.SERVER_TIMESTAMP,
    },
    {
        "title": "Computer Vision with OpenCV",
        "description": "Learn to process and analyze visual data using OpenCV and Python.",
        "author": "Grace Harper",
        "duration": 200,
        "level": "Advanced",
        "topics": ["Computer Vision", "OpenCV", "Image Processing"],
        "imageUrl": "https://images.unsplash.com/photo-1526378722484-bd91ca387e72",
        "createdAt": firestore.SERVER_TIMESTAMP,
    },
]


def add_sample_courses():
    """Add sample courses to Firestore."""
    print("Adding sample courses to Firestore...")

    for course in sample_courses:
        # Create a new course document with auto-generated ID
        new_course_ref = db.collection("courses").document()
        new_course_ref.set(course)
        print(f"Added course: {course['title']} (ID: {new_course_ref.id})")

    print("Sample courses added successfully!")


def check_existing_courses():
    """Check if there are already courses in the database."""
    courses_ref = db.collection("courses")
    courses = list(courses_ref.stream())
    return len(courses) > 0


if __name__ == "__main__":
    if check_existing_courses():
        proceed = input(
            "Courses already exist in the database. Add more sample courses? (y/n): "
        )
        if proceed.lower() != "y":
            print("Operation cancelled.")
            exit(0)

    add_sample_courses()
