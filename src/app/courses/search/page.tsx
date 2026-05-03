import { prisma } from "@/lib/prisma";
import CourseSearchClient from "./CourseSearchClient";
import './search.css';

const toFixed = (value: number) => Number(value.toFixed(1));

export default async function CourseSearchPage() {
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

  return <CourseSearchClient courses={allCourses} />;
}