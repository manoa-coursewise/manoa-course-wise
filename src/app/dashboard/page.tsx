
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserDashboard, { User } from '../../components/UserDashboard';


const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // redirecting
  }

  return (
    <main className="course-search-page">
      <UserDashboard user={session.user as User} />
    </main>
  );
};

export default DashboardPage;