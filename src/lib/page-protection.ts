import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

type PageSession = {
  user?: {
    email?: string | null;
    role?: string;
  };
} | null;

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: PageSession) => {
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: PageSession) => {
  loggedInProtectedPage(session);
  if (session?.user?.role !== Role.ADMIN) {
    redirect('/not-authorized');
  }
};
