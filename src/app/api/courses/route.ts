import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const toFixed = (value: number) => Number(value.toFixed(1));

export async function GET(req: NextRequest) {
  const department = req.nextUrl.searchParams.get('department');

  const allowedDepartments = ['ICS', 'MATH'];
  const prefix = department && allowedDepartments.includes(department.toUpperCase())
    ? `${department.toUpperCase()} `
    : null;

  try {
    const courses = await prisma.course.findMany({
      where: prefix
        ? { classId: { startsWith: prefix } }
        : {
            OR: [
              { classId: { startsWith: 'ICS ' } },
              { classId: { startsWith: 'MATH ' } },
            ],
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
        department: course.classId.split(' ')[0],
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

    return NextResponse.json(allCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}