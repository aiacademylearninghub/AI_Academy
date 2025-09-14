import React, { useEffect, useState } from "react";
import {
  useCourses,
  useEnrollCourse,
  Course as CourseType,
} from "../hooks/useCourses";
import { useAuth } from "../contexts/useAuth";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { Clock, BookOpen } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

// Custom CourseCard for our specific data structure
interface EnhancedCourseCardProps {
  course: CourseType;
  onEnroll: () => void;
  enrolling: boolean;
}

const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({
  course,
  onEnroll,
  enrolling,
}) => {
  return (
    <Card className="overflow-hidden hover:border-purple-500 transition-colors cursor-pointer">
      <img
        src={course.imageUrl || "/course-placeholder.jpg"}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="success">{course.level || "Beginner"}</Badge>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration} min
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {course.title}
        </h3>
        <p className="text-gray-400 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-300 text-sm">{course.author}</span>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/courses/${course.id}`}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              View
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                onEnroll();
              }}
              disabled={enrolling}
              className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CoursesPage: React.FC = () => {
  const { courses, loading, error } = useCourses();
  const { enrollInCourse, enrolling } = useEnrollCourse();
  const { token } = useAuth();
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<string | null>(
    null
  );
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  // Handle enrollment
  const handleEnroll = async (courseId: string) => {
    try {
      const result = await enrollInCourse(courseId);
      if (result) {
        setEnrollmentSuccess(
          `Successfully enrolled in course! View it in your dashboard.`
        );
        setEnrollmentError(null);
      }
    } catch (err) {
      setEnrollmentError("Failed to enroll in course. Please try again.");
      setEnrollmentSuccess(null);
    }
  };

  // Clear messages after some time
  useEffect(() => {
    if (enrollmentSuccess || enrollmentError) {
      const timer = setTimeout(() => {
        setEnrollmentSuccess(null);
        setEnrollmentError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [enrollmentSuccess, enrollmentError]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-4">
          You need to be logged in to view courses.
        </p>
        <Link
          to="/login"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold mb-4 text-red-500">
          Error Loading Courses
        </h1>
        <p className="text-muted-foreground">
          {error.message || "Something went wrong. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      {enrollmentSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {enrollmentSuccess}
        </div>
      )}

      {enrollmentError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {enrollmentError}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">
            No courses available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <EnhancedCourseCard
              key={course.id}
              course={course}
              onEnroll={() => handleEnroll(course.id)}
              enrolling={enrolling}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
