import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        reviews: {
          include: {
            course: true,
            professor: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        savedCourses: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const reviews = user.reviews.map((review) => ({
      id: review.id,
      course: review.course.classId,
      rating: review.rating,
      comment: review.text,
      professor: review.professor?.name ?? 'Professor N/A',
      semesterTaken: review.semesterTaken ?? 'Semester N/A',
    }));

    const savedCourses = user.savedCourses.map((saved) => ({
      classId: saved.course.classId,
      name: saved.course.name,
    }));

    return NextResponse.json({ reviews, savedCourses });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 },
    );
  }
}
