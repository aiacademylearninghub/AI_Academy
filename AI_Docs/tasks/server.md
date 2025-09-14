# AI Academy Backend (FastAPI) - System Overview

## 1. Task Overview
**Title:** Document Python FastAPI Backend Architecture and Workflow
**Goal:** Provide a clear, maintainable reference for the backend structure, API, authentication, and extensibility for easy onboarding and feature addition.

## 2. Project Analysis & Current State
- **Frameworks & Versions:** FastAPI, Poetry
- **Language:** Python 3.12+
- **Database & ORM:** Firestore (via Google Cloud SDK)
- **UI & Styling:** Serves static frontend
- **Authentication:** Firebase JWT (validated via Firebase Admin SDK)
- **Key Architectural Patterns:** Router-based API, dependency injection, Firestore abstraction

**Current State:**
- API endpoints in `app/routes/`
- Firestore access in `app/db/firestore.py`
- Auth enforced via `Depends(get_current_user)`
- Data models in `app/models/`, schemas in `app/schemas/`
- Static assets served from `/static/`

## 3. Context & Problem Definition
- **Problem:** Need for backend documentation to support onboarding and safe extension
- **Success Criteria:**
  - [x] API structure and key files documented
  - [x] Auth/data flow explained
  - [x] Steps to add new endpoints

## 4. Development Mode Context
- **Project Stage:** Active development
- **Breaking Changes:** Avoid if possible
- **Data Handling:** Use test data in dev
- **User Base:** All API consumers
- **Priority:** Stability and security

## 5. Technical Requirements
- **Functional:**
  - Expose REST API for courses, users, family, etc.
  - Validate JWT on protected endpoints
  - CRUD via Firestore
- **Non-Functional:**
  - Secure, performant, maintainable

## 6. Data & Database Changes
- Firestore document patterns: see Firestore doc

## 7. API & Backend Changes
- Add new endpoint: create in `app/routes/`, use dependency injection, update Firestore as needed

## 8. Frontend Changes
- N/A (serves static frontend only)

## 9. Implementation Plan
- See README and code comments for step-by-step guides

## 10. Task Completion Tracking
- Update this doc and code comments as features are added

## 11. File Structure & Organization
- See `app/` subfolders and README

## 12. AI Agent Instructions
- Follow router/DI pattern, document new endpoints, keep code DRY

## 13. Second-Order Impact Analysis
- Test API, auth, and data flows after changes

---
