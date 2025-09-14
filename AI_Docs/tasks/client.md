# AI Academy Frontend (React) - System Overview

## 1. Task Overview
**Title:** Document React Frontend Architecture and Workflow
**Goal:** Provide a clear, maintainable reference for the structure, data flow, and extensibility of the AI Academy React frontend, enabling easy onboarding and future feature additions.

## 2. Project Analysis & Current State
- **Frameworks & Versions:** React (TypeScript), Vite, Tailwind CSS
- **Language:** TypeScript
- **Database & ORM:** Firestore (via API and direct client utils)
- **UI & Styling:** Tailwind CSS, custom components
- **Authentication:** Firebase Auth
- **Key Architectural Patterns:** Component-based, hooks for data, context for auth/theme

**Current State:**
- Modular structure: `src/components/`, `src/pages/`, `src/hooks/`, `src/utils/`
- Auth handled via context and Firebase
- API calls abstracted in hooks/utils
- Navigation via `Navigation.tsx`/`Sidebar.tsx`
- Easily extensible for new pages/features

## 3. Context & Problem Definition
- **Problem:** Need for clear documentation to onboard devs and support rapid feature addition
- **Success Criteria:**
  - [x] All major flows and files documented
  - [x] Steps to add new features/pages/hooks
  - [x] Data/API flow explained

## 4. Development Mode Context
- **Project Stage:** Active development
- **Breaking Changes:** Avoid if possible
- **Data Handling:** Use test data in dev
- **User Base:** All frontend users
- **Priority:** Balance speed and stability

## 5. Technical Requirements
- **Functional:**
  - User can log in/out, enroll in courses, view progress
  - System fetches data from backend and Firestore
  - Hooks manage API/data logic
- **Non-Functional:**
  - Responsive, fast, accessible, theme support

## 6. Data & Database Changes
- No direct DB changes; uses backend API and Firestore utils

## 7. API & Backend Changes
- API calls via `useAuthenticatedFetch` and hooks
- Endpoints: `/api/courses`, `/api/settings/*`, etc.

## 8. Frontend Changes
- Add new page: create in `src/pages/`, add route in `App.tsx`, link in nav
- Add new hook: create in `src/hooks/`
- Add new component: create in `src/components/`

## 9. Implementation Plan
- See README and code comments for step-by-step guides

## 10. Task Completion Tracking
- Update this doc and code comments as features are added

## 11. File Structure & Organization
- See `src/` subfolders and README

## 12. AI Agent Instructions
- Follow modular/component pattern, keep code DRY, document new features

## 13. Second-Order Impact Analysis
- Test navigation, auth, and data flows after changes

---
