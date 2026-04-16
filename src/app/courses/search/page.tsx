'use client';

import { useState } from "react";
import Filters from "@/components/Filters";
import CourseCard from "@/components/CourseCard";
import './search.css';


const allCourses = [
  {
    code: "ICS 311",
    department: "ICS",
    title: "Algorithms",
    professor: "Kyle Berney",
    rating: 4.7,
    reviews: 218,
    difficulty: 4.1,
    workload: 3.9,
    clarity: 4.8,
    tags: ["Heavy Reading", "Strong Lectures", "Tough Exams"],
  },
  {
    code: "MATH 242",
    department: "MATH",
    title: "Calculus II",
    professor: "Austin Anderson",
    rating: 4.3,
    reviews: 167,
    difficulty: 4.2,
    workload: 3.7,
    clarity: 4.5,
    tags: ["Integration Heavy", "Series & Sequences"],
  },
  {
    code: "ECON 130",
    department: "ECON",
    title: "Principles of Microeconomics",
    professor: "Michael Roberts",
    rating: 4.0,
    reviews: 120,
    difficulty: 3.5,
    workload: 3.2,
    clarity: 4.1,
    tags: ["Light Reading"],
  },
];

export default function App() {
  const [selectedDepartments, setSelectedDepartments] = useState([
    "ICS",
    "MATH",
  ]);

  const [sortOption, setSortOption] = useState("lowToHigh");

  // 🔍 Filtering logic
  const filteredCourses = allCourses.filter((course) =>
    selectedDepartments.includes(course.department)
  );

  // 🔃 Sorting logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === "lowToHigh") return a.difficulty - b.difficulty;
    if (sortOption === "highToLow") return b.difficulty - a.difficulty;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3">
            <Filters
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
            />
          </div>

          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2>Courses</h2>
                <p className="text-muted">
                  Showing {sortedCourses.length} results
                </p>
              </div>

              <select
                className="form-select w-auto"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="lowToHigh">Difficulty (Low to High)</option>
                <option value="highToLow">Difficulty (High to Low)</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div className="row">
              {sortedCourses.map((course, idx) => (
                <div className="col-md-6 mb-4" key={idx}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-success px-5 py-2">
                Load More Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}