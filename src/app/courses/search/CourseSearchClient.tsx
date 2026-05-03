"use client";
import { useState, useMemo } from "react";
import CourseCard from "@/components/CourseCard";
import './search.css';

type Course = {
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
};

interface CourseSearchClientProps {
  courses: Course[];
}

export default function CourseSearchClient({ courses }: CourseSearchClientProps) {
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c: Course) => {
      const code = c.code.toLowerCase();
      const title = c.title.toLowerCase();
      const professor = c.professor.toLowerCase();
      // Extract the course number (e.g., '211' from 'ICS 211')
      const match = code.match(/ics\s*(\d+)/);
      const courseNum = match ? match[1] : '';
      if (/^\d+$/.test(q)) {
        // If query is all digits, match only the start of the course number
        return courseNum.startsWith(q);
      }
      // Otherwise, match code, title, or professor as before
      return code.includes(q) || title.includes(q) || professor.includes(q);
    });
  }, [search, courses]);

  return (
    <main className="course-search-page">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2>Courses</h2>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by course code, title, or professor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: 400 }}
                />
                <p className="course-results-summary">
                  Showing {filteredCourses.length} ICS results
                </p>
              </div>
            </div>
            <div className="row">
              {filteredCourses.map((course) => (
                <div className="col-md-6 mb-4" key={course.code}>
                  <a href={`/courses/details/${encodeURIComponent(course.code)}/${encodeURIComponent(course.professor)}`}>
                    <CourseCard course={course} />
                  </a>
                </div>
              ))}
            </div>
            {filteredCourses.length === 0 && <p className="course-empty-state">No ICS courses found.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
