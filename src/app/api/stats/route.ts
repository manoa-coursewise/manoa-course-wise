import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [courseCount, professorCount, reviewCount, avgRatingResult] = await Promise.all([
      prisma.course.count(),
      prisma.professor.count(),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    const avgRating = avgRatingResult._avg.rating
      ? Number(avgRatingResult._avg.rating.toFixed(1))
      : 0;

    return NextResponse.json({ courseCount, professorCount, reviewCount, avgRating });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 },
    );
  }
}
