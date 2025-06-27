import React, { useState, useEffect } from "react";
import coursesData from "../data/courses.json";
import YouTubePlayer from "../components/YouTubePlayer";

// Types that match our new JSON structure
interface Course {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
}

interface Subcategory {
  id: string;
  name: string;
  courses: Course[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  courses?: Course[];
  subcategories?: Subcategory[];
}

interface CoursesData {
  categories: Category[];
}

export function CourseViewer() {
  const data = coursesData as unknown as CoursesData;
  
  // Use useMemo to prevent unnecessary re-renders and fix dependency issues
  const categories = React.useMemo(() => {
    return data.categories || [];
  }, [data.categories]);
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    Subcategory | undefined
  >(undefined);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);// Initialize with the first available course when component mounts
  useEffect(() => {
    // This function is only used during initialization, so it's safe to define it inside useEffect
    const findFirstAvailableCourse = () => {
      if (categories.length === 0) {
        return null;
      }
      
      // Check main categories with direct courses
      for (const category of categories) {
        if (category.courses && category.courses.length > 0) {
          return { category, course: category.courses[0] };
        }
        // Check subcategories
        if (category.subcategories) {
          for (const subcategory of category.subcategories) {
            if (subcategory.courses && subcategory.courses.length > 0) {
              return { category, subcategory, course: subcategory.courses[0] };
            }
          }
        }
      }
      return null;
    };
    
    const initialData = findFirstAvailableCourse();
    if (initialData) {
      setSelectedCategory(initialData.category);
      setSelectedSubcategory(initialData.subcategory);
      setSelectedCourse(initialData.course);
    }
    setIsLoading(false);
  }, [categories]); // Now we properly include categories as a dependency

  const handleSelectCourse = (
    category: Category,
    subcategory: Subcategory | undefined,
    course: Course
  ) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedCourse(course);
  };

  // Handle loading state
  if (isLoading) {
    return <div className="p-6 text-center">Loading courses...</div>;
  }

  // If there are no categories or courses, display a message
  if (!categories.length || !selectedCourse) {
    return <div className="p-6 text-center">No courses available</div>;
  }

  // Helper function to get category name display
  const getCategoryDisplay = () => {
    if (!selectedCategory) return "";

    if (selectedSubcategory) {
      return `${selectedCategory.name} > ${selectedSubcategory.name}`;
    }
    return selectedCategory.name;
  };
  return (
    <div className="flex flex-col lg:flex-row h-full space-y-4 lg:space-y-0 lg:space-x-4">
      {/* Video Player Section */}
      <div className="flex-1">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {/* YouTube Video Player */}
          {selectedCourse && <YouTubePlayer url={selectedCourse.youtubeUrl} />}
        </div>

        {/* Video Info */}
        {selectedCourse && (
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedCourse.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Category: {getCategoryDisplay()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedCourse.description}
            </p>
          </div>
        )}
      </div>

      {/* Playlist Section */}
      <div className="w-full lg:w-80">
        <div className="h-full overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Course Categories
            </h2>
          </div>
          <div className="overflow-y-auto max-h-[300px] lg:max-h-[calc(100vh-20rem)]">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border-b border-gray-700 last:border-b-0"
              >
                <h3 className="px-4 py-3 bg-gray-800 text-white font-medium text-sm">
                  {category.name}
                </h3>

                {/* Direct courses in category */}
                {category.courses?.map((course) => (
                  <button
                    key={course.id}
                    onClick={() =>
                      handleSelectCourse(category, undefined, course)
                    }
                    className={`w-full p-4 flex items-start hover:bg-gray-800 transition-colors ${
                      selectedCourse && selectedCourse.id === course.id
                        ? "bg-gray-800"
                        : ""
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-medium text-gray-300">
                        {course.title}
                      </h4>
                    </div>
                  </button>
                ))}

                {/* Subcategories */}
                {category.subcategories?.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="ml-4 border-l border-gray-700"
                  >
                    <h4 className="px-4 py-2 text-sm font-medium text-gray-400">
                      {subcategory.name}
                    </h4>
                    {subcategory.courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() =>
                          handleSelectCourse(category, subcategory, course)
                        }
                        className={`w-full p-4 flex items-start hover:bg-gray-800 transition-colors ${
                          selectedCourse && selectedCourse.id === course.id
                            ? "bg-gray-800"
                            : ""
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <h5 className="text-sm font-medium text-gray-300">
                            {course.title}
                          </h5>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
