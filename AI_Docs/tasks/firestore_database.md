# AI Academy Firestore Database - System Overview

## 1. Task Overview
**Title:** Document Firestore Database Structure and Usage
**Goal:** Provide a clear reference for Firestore collections, document patterns, and data access to support safe extension and debugging.

## 2. Project Analysis & Current State
- **Frameworks & Versions:** Firestore (Google Cloud)
- **Language:** Used via Python (backend) and TypeScript (frontend)
- **Database & ORM:** Firestore (NoSQL)
- **Authentication:** Firebase Auth
- **Key Architectural Patterns:** Document/collection, user-centric data

**Current State:**
- Collections: `courses`, `enrollments`, `users`, `family`
- Document keys: e.g., `enrollments/{userId}_{courseId}`
- Accessed via backend and some direct client utils

## 3. Context & Problem Definition
- **Problem:** Need for clear DB structure documentation for onboarding and safe schema evolution
- **Success Criteria:**
  - [x] All collections and key patterns documented
  - [x] Data model and access patterns explained

## 4. Development Mode Context
- **Project Stage:** Active development
- **Breaking Changes:** Avoid destructive schema changes
- **Data Handling:** Backup before changes
- **User Base:** All users
- **Priority:** Data integrity

## 5. Technical Requirements
- **Functional:**
  - Store user, course, enrollment, and family data
  - Support queries for API and client
- **Non-Functional:**
  - Secure, scalable, low-latency

## 6. Data & Database Changes
- See document patterns above

## 7. API & Backend Changes
- Data access via backend and some direct client utils

## 8. Frontend Changes
- Uses Firestore utils for some real-time features

## 9. Implementation Plan
- Update this doc as schema evolves

## 10. Task Completion Tracking
- Track changes in this doc and code comments

## 11. File Structure & Organization
- See backend `app/db/firestore.py` and frontend `src/utils/firestoreUtils.ts`

## 12. AI Agent Instructions
- Document new collections/fields, avoid destructive changes

## 13. Second-Order Impact Analysis
- Test all data flows after schema changes

---
