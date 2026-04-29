import CourseSearch from "@/components/CourseSearch";
import { Suspense } from "react";
import './search.css';

function CourseSearchFallback() {
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

export default function App() {
  return (
    <Suspense fallback={<CourseSearchFallback />}>
      <CourseSearch />
    </Suspense>
  );
}