/**
 * @file This file is responsible for initializing and configuring the Firebase application instance.
 * It reads the Firebase configuration keys from environment variables, ensuring that
 * sensitive information is not hard-coded. It initializes the Firebase app and exports
 * the `auth` instance for use in other parts of the application, such as the AuthContext.
 *
 * This setup implements a singleton pattern to prevent re-initializing the app on hot reloads.
 *
 * @exports app - The initialized Firebase app instance.
 * @exports auth - The Firebase Auth service instance.
 * @exports signInWithGoogle - A utility function to sign in with Google.
 * @exports db - The Firestore database instance.
 */
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Define the signInWithGoogle function
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  // You might want to add custom parameters for the provider if needed
  // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  return signInWithPopup(auth, provider); // Use signInWithPopup or signInWithRedirect
};

export { app, auth, db, signInWithGoogle };
