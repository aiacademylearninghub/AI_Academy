import { useState, useEffect } from 'react';
import { useAuthenticatedFetch } from '../utils/apiUtils';

// Define Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  author: string;
  imageUrl?: string;
  duration: number;
  level?: string;
  topics?: string[];
  createdAt?: any;
  updatedAt?: any;
}

// Define Enrollment interface with course data
export interface Enrollment {
  enrollmentId: string;
  progress: number;
  completed: boolean;
  enrolledAt: any;
  lastAccessed: any;
  course: Course;
}

// Define API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Hook to fetch all available courses
 */
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const authFetch = useAuthenticatedFetch();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authFetch(`${API_BASE_URL}/courses`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        console.error('Failed to fetch courses:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [authFetch]);

  return { courses, loading, error };
};

/**
 * Hook to fetch a specific course by ID
 */
export const useCourse = (courseId: string | null) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const authFetch = useAuthenticatedFetch();

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authFetch(`${API_BASE_URL}/courses/${courseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        console.error(`Failed to fetch course ${courseId}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, authFetch]);

  return { course, loading, error };
};

/**
 * Hook to fetch user's course enrollments
 */
export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const authFetch = useAuthenticatedFetch();

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authFetch(`${API_BASE_URL}/enrollments`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch enrollments');
        }
        const data = await response.json();
        setEnrollments(data);
      } catch (err: any) {
        console.error('Failed to fetch enrollments:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [authFetch]);

  return { enrollments, loading, error };
};

/**
 * Hook to enroll in a course
 */
export const useEnrollCourse = () => {
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const authFetch = useAuthenticatedFetch();

  const enrollInCourse = async (courseId: string) => {
    setEnrolling(true);
    setSuccess(false);
    setError(null);
    try {
      const response = await authFetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to enroll in course');
      }
      
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error(`Failed to enroll in course ${courseId}:`, err);
      setError(err);
      return false;
    } finally {
      setEnrolling(false);
    }
  };

  return { enrollInCourse, enrolling, success, error };
};

/**
 * Hook to update course progress
 */
export const useUpdateProgress = () => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const authFetch = useAuthenticatedFetch();

  const updateProgress = async (courseId: string, progress: number, completed: boolean = false) => {
    setUpdating(true);
    setSuccess(false);
    setError(null);
    try {
      const response = await authFetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ progress, completed }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update progress');
      }
      
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error(`Failed to update progress for course ${courseId}:`, err);
      setError(err);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateProgress, updating, success, error };
};
