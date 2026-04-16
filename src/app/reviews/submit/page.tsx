import { loggedInProtectedPage } from '@/lib/page-protection';
import SubmitReviewForm from '@/components/SubmitReviewForm';
import { auth } from '@/lib/auth';

const SubmitReview = async () => {
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name?: string };
    } | null,
  );
  return (
    <main>
      <SubmitReviewForm />
    </main>
  );
};

export default SubmitReview;
