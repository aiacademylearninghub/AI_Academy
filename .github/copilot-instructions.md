# AI Academy Project Guide

## Architecture Overview

AI Academy is a full-stack learning platform with:

- **React TypeScript frontend** (`Client/`)
- **Python FastAPI backend** (`Server/`)
- **Firebase/Firestore** for authentication and persistent data

```
Client (React/TS) <-> Server (FastAPI) <-> Firebase/Firestore
```

## Core Data & Logic Flows

### Authentication

- **Frontend:** Uses Firebase Auth (`src/utils/firebase.ts`, `src/contexts/AuthContext.tsx`).
  - Handles login/signup (email/password, Google), stores session in localStorage.
- **Backend:** Validates JWT tokens from client using Firebase Admin SDK (`app/core/security.py`).
  - All protected endpoints require `Authorization: Bearer <token>`.

### Course & Enrollment Data

- **Courses:**
  - Fetched via `/api/courses` (see `app/routes/api.py`).
  - Each course is a Firestore document with fields: `title`, `description`, `author`, `duration`, etc.
- **Enrollments:**
  - Created via `/api/courses/{course_id}/enroll` (see `useEnrollCourse` in `src/hooks/useCourses.ts`).
  - Enrollment documents are keyed as `userId_courseId` in Firestore.
  - Progress is tracked and updated via `/api/courses/{course_id}/progress`.

### User Profiles & Family Linking

- User profiles are stored in Firestore (`users` collection).
- Family linking is managed via `/api/settings/family-request` and `/api/settings/accept-invitation` (see `app/routes/settings.py`).
  - Invitations are sent by email and stored in Firestore.
  - Family relationships are stored in the `family` collection.

## Key Code Patterns & Conventions

- **Frontend:**
  - API calls use `useAuthenticatedFetch` (`src/utils/apiUtils.ts`) to auto-attach tokens and handle session refresh.
  - Data fetching and mutations are encapsulated in React hooks (`src/hooks/useCourses.ts`).
  - UI is composed of reusable components (`src/components/`), with Tailwind CSS for styling.
  - Pages in `src/pages/` map to routes; navigation is in `Navigation.tsx` and `Sidebar.tsx`.
- **Backend:**
  - All API endpoints are in `app/routes/` (e.g., `api.py` for courses, `settings.py` for user/family).
  - Firestore access is abstracted in `app/db/firestore.py`.
  - Authentication is enforced via dependency injection (`Depends(get_current_user)`).
  - Data models and validation are in `app/models/` and `app/schemas/`.

## Development Workflow

### Running Locally

**Frontend:**

```sh
cd Client
npm install
npm run dev  # http://localhost:5173
```

**Backend:**

```sh
cd Server
.venv\Scripts\activate.bat
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Build & Deploy

```sh
cd Client
npm run build
cd ..
powershell -ExecutionPolicy Bypass -File .\Client\build_and_transfer.ps1
```

## Adding Features

### New API Endpoint

1. Add route in `Server/app/routes/` (use FastAPI router, see `api.py` for examples).
2. Use `Depends(get_current_user)` for auth.
3. Update Firestore via `get_firestore_client()`.
4. Add client hook in `Client/src/hooks/` and/or API util in `src/utils/apiUtils.ts`.

### New Frontend Page

1. Add component in `Client/src/pages/`.
2. Register route in `Client/src/App.tsx`.
3. Add navigation link in `Navigation.tsx` or `Sidebar.tsx`.

## Project-Specific Details

- **Firestore Document Patterns:**
  - Courses: `courses/{courseId}`
  - Enrollments: `enrollments/{userId}_{courseId}`
  - Users: `users/{uid}`
  - Family: `family/{uid}`
- **Session Handling:**
  - Tokens are refreshed automatically by the frontend if expired (see `useAuthenticatedFetch`).
- **Direct Firestore Access:**
  - Some client features (e.g., real-time updates) use `src/utils/firestoreUtils.ts` for direct Firestore reads/writes.
- **Email Integration:**
  - Family invitations use SMTP (see `EMAIL_PASSWORD` in server env).
- **Static Assets:**
  - Frontend build is copied to `Server/static/` for production serving.

## Troubleshooting

- If API requests fail with 401, check token validity and Firebase config.
- For email features, ensure SMTP credentials are set in server environment.
- For CORS issues, update `CORS_ORIGINS` in server env.

## References

- Example API: `app/routes/api.py`, `app/routes/settings.py`
- Example client data flow: `src/hooks/useCourses.ts`, `src/pages/CoursesPage.tsx`
- Firestore utils: `src/utils/firestoreUtils.ts`

---

For more, see `README-INTEGRATION.md` and code comments in key files.
