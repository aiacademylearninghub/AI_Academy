import React, { createContext, useEffect, useState, useCallback } from "react";
import { AuthState } from "../types/auth";
import { auth, signInWithGoogle, db } from "../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  signInWithGooglePopup: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Session constants - in a real app these would be configurable
const TOKEN_EXPIRY_DAYS = 14;
const SESSION_STORAGE_KEY = "aiacademy_session";

// Demo user data - in a real app, this would come from a backend
const DEMO_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    name: "Demo User",
    profileImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    tokenExpiry: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Helper function to save user to Firestore
  const saveUserToFirestore = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // If the user doesn't exist in Firestore yet, add them
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous User",
          photoURL:
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.displayName || "User"
            )}&background=6366F1&color=fff`,
          createdAt: new Date(),
        });
      }

      return userSnap.data();
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      throw error;
    }
  };

  // Function to generate a token - in a real app, this would come from a backend
  const generateToken = useCallback(() => {
    // Create a mock token that expires in TOKEN_EXPIRY_DAYS
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(now.getDate() + TOKEN_EXPIRY_DAYS);

    return {
      value: `mock-jwt-token-${Math.random().toString(36).substring(2, 15)}`,
      expiryTs: expiry.getTime(),
    };
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback((expiryTimestamp: number | null) => {
    if (!expiryTimestamp) return true;
    return Date.now() > expiryTimestamp;
  }, []);

  // Load user session from localStorage on initial load
  useEffect(() => {
    const loadSession = async () => {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);

      if (sessionData) {
        try {
          const { user, token, tokenExpiry } = JSON.parse(sessionData);

          // Check if token is expired
          if (!isTokenExpired(tokenExpiry)) {
            setState({
              user,
              token,
              tokenExpiry,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Token expired, clear session
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setState({
              user: null,
              token: null,
              tokenExpiry: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } catch {
          // Invalid session data, clear it
          localStorage.removeItem(SESSION_STORAGE_KEY);
          setState({
            user: null,
            token: null,
            tokenExpiry: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    };

    loadSession();
  }, [isTokenExpired]);

  // Function to refresh the session token
  const refreshSession = useCallback(async (): Promise<boolean> => {
    // Only refresh if we have a user
    if (!state.user) return false;

    try {
      // In a real app, this would be an API call to refresh the token
      // For this demo, we'll just generate a new token
      const { value: newToken, expiryTs } = generateToken();

      const sessionData = {
        user: state.user,
        token: newToken,
        tokenExpiry: expiryTs,
      };

      // Store refreshed session
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

      setState((prevState) => ({
        ...prevState,
        token: newToken,
        tokenExpiry: expiryTs,
        isAuthenticated: true,
      }));

      return true;
    } catch {
      return false;
    }
  }, [state.user, generateToken]);

  // Login function
  const login = async (email: string, password: string) => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find user with matching credentials (demo only)
      const user = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Remove password before storing in state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...secureUser } = user;

        // Generate a token
        const { value: token, expiryTs: tokenExpiry } = generateToken();

        // Create session data
        const sessionData = {
          user: secureUser,
          token,
          tokenExpiry,
        };

        // Store in localStorage for session persistence
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

        setState({
          user: secureUser,
          token,
          tokenExpiry,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  // Signup function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = async (name: string, email: string, password: string) => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if email already exists (demo only)
      if (DEMO_USERS.some((user) => user.email === email)) {
        throw new Error("Email already in use");
      }

      // Create new user (in a real app this would be saved to a database)
      const newUser = {
        id: String(DEMO_USERS.length + 1),
        name,
        email,
        // Store password in DEMO_USERS in a real app
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=6366F1&color=fff`,
      };

      // In a real app, we would add the user to our database here with hashed password
      // DEMO_USERS.push({ ...newUser, password: hashedPassword });

      // Generate a token
      const { value: token, expiryTs: tokenExpiry } = generateToken();

      // Create session data
      const sessionData = {
        user: newUser,
        token,
        tokenExpiry,
      };

      // Store in localStorage for session persistence
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

      // Set the state with authentication data
      setState({
        user: newUser,
        token,
        tokenExpiry,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // In a real app, we would add the user to our database here
      // DEMO_USERS.push({ ...newUser, password });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Signup failed",
      });
    }
  };

  // Google Sign In function
  const signInWithGooglePopup = async () => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Save user to Firestore
      await saveUserToFirestore(user);

      // Create formatted user object for our app
      const formattedUser = {
        id: user.uid,
        email: user.email || "",
        name: user.displayName || "Anonymous User",
        profileImage:
          user.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.displayName || "User"
          )}&background=6366F1&color=fff`,
      };

      // Generate a token (using Firebase's ID token)
      const token = await user.getIdToken();
      const tokenExpiry = Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      // Store session data
      const sessionData = {
        user: formattedUser,
        token,
        tokenExpiry,
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

      setState({
        user: formattedUser,
        token,
        tokenExpiry,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Google sign in failed",
      });
    }
  };

  // Logout function
  const logout = () => {
    // Sign out from Firebase
    auth.signOut().catch(console.error);

    // Clear local storage
    localStorage.removeItem(SESSION_STORAGE_KEY);

    // Update state
    setState({
      user: null,
      token: null,
      tokenExpiry: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    refreshSession,
    signInWithGooglePopup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook moved to useAuth.ts
