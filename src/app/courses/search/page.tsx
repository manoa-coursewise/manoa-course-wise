import { prisma } from "@/lib/prisma";
import CourseCard from "@/components/CourseCard";
import './search.css';

const toFixed = (value: number) => Number(value.toFixed(1));

export default async function App() {
  const courses = await prisma.course.findMany({
    where: {
      classId: {
        startsWith: 'ICS ',
      },
    },
    include: {
      professors: {
        orderBy: {
          name: 'asc',
        },
      },
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      classId: 'asc',
    },
  });

  const allCourses = courses.map((course) => {
    const reviewCount = course.reviews.length;
    const totals = course.reviews.reduce(
      (acc, review) => {
        acc.rating += review.rating;
        acc.difficulty += review.difficulty;
        acc.workload += review.workload;
        acc.clarity += review.clarity;
        return acc;
      },
      { rating: 0, difficulty: 0, workload: 0, clarity: 0 },
    );

    const tagCounts = new Map<string, number>();
    course.reviews.forEach((review) => {
      review.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    });

    const tags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    const leadProfessor = course.professors[0]?.name ?? 'TBA';

    return {
      code: course.classId,
      department: 'ICS',
      title: course.name,
      professor: leadProfessor,
      rating: reviewCount ? toFixed(totals.rating / reviewCount) : 0,
      reviews: reviewCount,
      difficulty: reviewCount ? toFixed(totals.difficulty / reviewCount) : 0,
      workload: reviewCount ? toFixed(totals.workload / reviewCount) : 0,
      clarity: reviewCount ? toFixed(totals.clarity / reviewCount) : 0,
      tags,
    };
  });

  return (
    <main className="course-search-page">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2>Courses</h2>
                <p className="text-muted">
                  Showing {allCourses.length} ICS results
                </p>
              </div>
            </div>
            <div className="row">
              {allCourses.map((course) => (
                <div className="col-md-6 mb-4" key={course.code}>
                  <a href={`/courses/details/${encodeURIComponent(course.code)}/${encodeURIComponent(course.professor)}`}>
                    <CourseCard course={course} />
                  </a>
                </div>
              ))}
            </div>
            {allCourses.length === 0 && <p className="text-muted">No ICS courses found in the database yet.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}