'use client';

import UserDashboard from '../../components/UserDashboard';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

export default function DashboardMockPage() {
  return <UserDashboard user={mockUser} />;
}