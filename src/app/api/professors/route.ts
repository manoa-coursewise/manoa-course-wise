import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const professors = await prisma.professor.findMany({
      include: {
        course: true,
      },
      orderBy: [
        { courseId: 'asc' },
        { name: 'asc' },
      ],
    });
    return NextResponse.json(professors);
  } catch (error) {
    console.error('Error fetching professors:', error);
    return NextResponse.json({ error: 'Failed to fetch professors' }, { status: 500 });
  }
}
