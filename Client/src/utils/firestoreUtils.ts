/**
 * @file This file provides Firestore utility functions for direct client-side database operations.
 * These functions complement the server API for operations that can be performed directly
 * client-side, such as fetching user-specific data or real-time updates.
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Course, Enrollment } from '../hooks/useCourses';

/**
 * Interface for user profile data
 */
export interface UserProfile {
  uid: string;
  name?: string;
  email: string;
  photoURL?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Create or update a user profile in Firestore
 */
export const saveUserProfile = async (userData: UserProfile): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userData.uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      // Create new user
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Get a user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Get course enrollments for a user
 */
export const getUserEnrollments = async (uid: string): Promise<Enrollment[]> => {
  try {
    // Query enrollments for the user
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', uid),
      orderBy('enrolledAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const enrollments: Enrollment[] = [];
    
    // For each enrollment, get the associated course
    for (const enrollDoc of querySnapshot.docs) {
      const enrollData = enrollDoc.data();
      const courseId = enrollData.courseId;
      
      // Get course details
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      
      if (courseSnap.exists()) {
        const courseData = courseSnap.data() as Course;
        
        enrollments.push({
          enrollmentId: enrollDoc.id,
          progress: enrollData.progress || 0,
          completed: enrollData.completed || false,
          enrolledAt: enrollData.enrolledAt,
          lastAccessed: enrollData.lastAccessed,
          course: {
            id: courseSnap.id,
            ...courseData
          }
        });
      }
    }
    
    return enrollments;
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    throw error;
  }
};

/**
 * Get a course by ID
 */
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (courseSnap.exists()) {
      return {
        id: courseSnap.id,
        ...courseSnap.data()
      } as Course;
    } else {
      console.log('Course not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

/**
 * Get all available courses
 */
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, 'courses');
    const querySnapshot = await getDocs(coursesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Course[];
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

/**
 * Update user progress in a course
 */
export const updateCourseProgress = async (
  userId: string, 
  courseId: string, 
  progress: number, 
  completed: boolean = false
): Promise<void> => {
  try {
    const enrollmentId = `${userId}_${courseId}`;
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);
    
    await updateDoc(enrollmentRef, {
      progress,
      completed,
      lastAccessed: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
};

/**
 * Add a note to a course
 */
export const addCourseNote = async (
  userId: string,
  courseId: string,
  note: string
): Promise<string> => {
  try {
    // Create a unique ID for the note
    const timestamp = new Date().getTime();
    const noteId = `note_${timestamp}`;
    
    // Get the enrollment document
    const enrollmentId = `${userId}_${courseId}`;
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);
    
    // Add the note to the enrollment document
    await updateDoc(enrollmentRef, {
      notes: arrayUnion({
        id: noteId,
        text: note,
        createdAt: serverTimestamp()
      })
    });
    
    return noteId;
  } catch (error) {
    console.error('Error adding course note:', error);
    throw error;
  }
};
