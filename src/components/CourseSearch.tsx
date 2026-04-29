"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import Searchbar from "@/components/Searchbar";

interface Course {
  code: string;
  department: string;
  title: string;
  professor: string;
  rating: number;
  reviews: number;
  difficulty: number;
  workload: number;
  clarity: number;
  tags: string[];
}

const CourseSearch = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryFromUrl = searchParams.get('query') || '';
    setSearchQuery(queryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return courses.filter((course) => {
      return [
        course.code,
        course.title,
        course.professor,
        ...course.tags
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [courses, searchQuery]);

  if (loading) {
    return (
      <main className="course-search-page">
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-12">
              <div className="course-search-header mb-4">
                <h2>Courses</h2>
                <p className="course-results-summary">Loading courses...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="course-search-page">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="course-search-header mb-4">
              <h2>Courses</h2>
              <p className="course-results-summary">
                Showing {filteredCourses.length} of {courses.length} results
                {searchQuery ? ` for "${searchQuery}"` : ""}
              </p>
            </div>

            <Searchbar onSearch={setSearchQuery} initialQuery={searchQuery} />

            <div className="row">
              {filteredCourses.map((course) => (
                <div className="col-md-6 mb-4" key={`${course.code}-${course.professor}`}>
                  <a href={`/courses/details/${encodeURIComponent(course.code)}/${encodeURIComponent(course.professor)}`}>
                    <CourseCard course={course} />
                  </a>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <p className="course-empty-state">
                No courses matched your search. Try different keywords.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseSearch;