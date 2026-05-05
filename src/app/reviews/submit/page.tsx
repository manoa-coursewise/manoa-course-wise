import { loggedInProtectedPage } from '@/lib/page-protection';
import SubmitReviewForm from '@/components/SubmitReviewForm';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';


const SubmitReview = async () => {
  const session = await auth();
  loggedInProtectedPage(session);
  const courses = await prisma.course.findMany({
    include: {
      professors: {
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: {
      classId: 'asc',
    },
  });
  return (
    <main>
      <SubmitReviewForm courses={courses} />
    </main>
  );
};

export default SubmitReview;
