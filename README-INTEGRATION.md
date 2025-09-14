# AI Academy - React to Python with Firebase Integration

This document provides an overview of the communication setup between the React frontend and Python backend, with Firebase Firestore as the database.

## Architecture Overview

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│            │      │            │      │            │
│   React    │<────>│   Python   │<────>│  Firebase  │
│  Frontend  │      │  Backend   │      │ Firestore  │
│            │      │            │      │            │
└────────────┘      └────────────┘      └────────────┘
```

## Components

### 1. React Frontend

The React frontend communicates with the Python backend through a RESTful API and can also interact directly with Firebase for authentication and some Firestore operations.

Key files:
- `src/hooks/useCourses.ts`: React hooks for course management
- `src/utils/apiUtils.ts`: Utilities for API calls with authentication
- `src/utils/firebase.ts`: Firebase initialization
- `src/utils/firestoreUtils.ts`: Direct Firestore operations
- `src/pages/CoursesPage.tsx`: Example page using the API

### 2. Python Backend (FastAPI)

The Python backend provides RESTful API endpoints that handle authentication and data operations. It serves as a secure middleware between the frontend and Firestore.

Key files:
- `app/routes/api.py`: API endpoints for courses
- `app/routes/settings.py`: API endpoints for user settings
- `app/core/security.py`: Authentication with Firebase tokens
- `app/db/firestore.py`: Firestore database integration
- `app/db/init_db.py`: Database initialization

### 3. Firebase Firestore

Firebase Firestore serves as the main database, storing:
- User profiles
- Courses
- Enrollments
- Family connections

## Authentication Flow

1. User logs in through Firebase Authentication in the React app
2. Firebase returns a JWT token
3. React app includes the token in API requests to the Python backend
4. Python backend validates the token using Firebase Admin SDK
5. If valid, the request is processed and data is retrieved/modified in Firestore

## Data Flow

### Course Management Flow

1. **Fetching Courses**:
   - React calls `GET /api/courses` endpoint
   - Python backend authenticates the request
   - Backend retrieves courses from Firestore
   - Data is returned to React

2. **Course Enrollment**:
   - React calls `POST /api/courses/{course_id}/enroll`
   - Python backend authenticates the request
   - Backend creates enrollment document in Firestore
   - Confirmation is returned to React

3. **Progress Tracking**:
   - React calls `PUT /api/courses/{course_id}/progress`
   - Python backend authenticates the request
   - Backend updates enrollment document in Firestore
   - Confirmation is returned to React

### User Settings Flow

1. **Profile Management**:
   - React calls `GET/PUT /api/settings`
   - Python backend authenticates the request
   - Backend retrieves/updates user profile in Firestore
   - Data or confirmation is returned to React

2. **Family Linking**:
   - React calls `POST /api/settings/family-request`
   - Python backend authenticates the request
   - Backend sends invitation email with token
   - Recipient accepts invitation through frontend
   - Frontend calls `POST /api/settings/accept-invitation`
   - Backend creates family connection in Firestore

## Getting Started

### Prerequisites

1. Firebase project with Firestore enabled
2. Firebase service account key (JSON file)
3. Python 3.8+ with FastAPI and firebase-admin
4. Node.js 14+ with React

### Setup

1. **Firebase Setup**:
   - Place Firebase config in `.env` for React
   - Place Firebase service account JSON in Server folder

2. **Python Backend**:
   - Install dependencies: `pip install -r requirements.txt`
   - Run server: `python run_app.py`

3. **React Frontend**:
   - Install dependencies: `npm install`
   - Run development server: `npm run dev`

4. **Initialize Sample Data**:
   - Run `python initialize_courses.py` to populate Firestore with courses

## Security Considerations

- Token validation on all API endpoints
- Firestore security rules for direct client access
- Environment variables for sensitive information
- CORS configuration for allowed origins
