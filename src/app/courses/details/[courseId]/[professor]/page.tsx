import '../../details.css';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CourseDetailView from '@/components/CourseDetailView';

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string;
    professor: string;
  }>;
};

const CourseDetail = async ({ params }: CourseDetailPageProps) => {
  const { courseId } = await params;
  const decodedCourseId = decodeURIComponent(courseId);

  const course = await prisma.course.findUnique({
    where: { classId: decodedCourseId },
    include: {
      professors: {
        orderBy: { name: 'asc' },
      },
      reviews: {
        include: {
          professor: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return <CourseDetailView course={course} />;
};

export default CourseDetail;
