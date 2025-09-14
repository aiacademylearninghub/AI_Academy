# Firebase Authentication and Firestore Setup Guide

## Overview
This document provides instructions on how to set up Firebase authentication with Google Sign-In and Firestore for the AI Academy application.

## Setup Steps

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name your project (e.g., "AI Academy")
4. Follow the setup steps (you can disable Google Analytics if not needed)

### 2. Configure Authentication
1. In your Firebase project, go to "Authentication" from the left sidebar
2. Click "Get Started"
3. Enable Google as a sign-in provider:
   - Click on the "Google" provider
   - Enable it with the toggle switch
   - Configure the OAuth consent screen if prompted
   - Save

### 3. Set Up Firestore
1. Go to "Firestore Database" from the left sidebar
2. Click "Create database"
3. Start in production mode (or test mode for development)
4. Choose a location close to your users
5. Create the database

### 4. Create a Web App
1. Go to Project Settings (gear icon in the top left)
2. Scroll down to "Your apps" section
3. Click the "</>" (Web) icon
4. Register your app with a nickname (e.g., "AI Academy Web")
5. (Optional) Set up Firebase Hosting
6. Click "Register app"
7. Copy the Firebase configuration object shown

### 5. Configure Environment Variables
1. Create a `.env` file in your project root (or edit the existing one)
2. Add your Firebase configuration:
```
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

### 6. Firebase Firestore Rules
For security, update your Firestore rules in the Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write only their own data
    match /users/{userId} {
      allow create;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other collection rules as needed
  }
}
```

## User Data Structure in Firestore

The application stores user data in the "users" collection with the following structure:

```typescript
interface User {
  uid: string;          // User ID from Firebase Auth
  email: string;        // User's email address
  displayName: string;  // User's display name
  photoURL: string;     // URL to the user's profile image
  createdAt: Date;      // Timestamp when the user was created
}
```

## Additional Information

- The implementation uses Firebase's client SDK with `signInWithPopup` method.
- User authentication state is managed through the application's AuthContext.
- When a user signs in with Google, their information is automatically stored in Firestore.
