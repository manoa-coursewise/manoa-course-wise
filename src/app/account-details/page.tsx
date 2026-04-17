'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Card, Form, Button, Alert, Badge } from 'react-bootstrap';

const AccountDetailsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [nameEdits, setNameEdits] = useState<string | undefined>(undefined);
  const [emailEdits, setEmailEdits] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const accountRole = session?.user?.role ?? 'Student';
  const emailVerified = Boolean(session?.user?.email);
  const createdAt = 'August 12, 2024';
  const lastLogin = 'April 16, 2026, 09:24 AM';

  const sessionName = session?.user?.name ?? session?.user?.email ?? '';
  const sessionEmail = session?.user?.email ?? '';
  const name = nameEdits ?? sessionName;
  const email = emailEdits ?? sessionEmail;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setMessage('Account details updated successfully.');
    }, 1000);
  };

  const handleChangePassword = () => {
    router.push('/auth/change-password');
  };

  const handleSignOut = () => {
    router.push('/auth/signout');
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <main className="dashboard-main" style={{ padding: '40px 0' }}>
      <Container style={{ maxWidth: '520px' }}>
        <Card className="mb-4">
          <Card.Header>
            <h2>Account Details</h2>
          </Card.Header>
          <Card.Body>
            <p>
              <strong>Role:</strong> {accountRole}
            </p>
            <p>
              <strong>Email verified:</strong>{' '}
              <Badge bg={emailVerified ? 'success' : 'secondary'}>
                {emailVerified ? 'Yes' : 'No'}
              </Badge>
            </p>
            <p>
              <strong>Account created:</strong> {createdAt}
            </p>
            <p>
              <strong>Last login:</strong> {lastLogin}
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="accountName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setNameEdits(e.target.value)}
                  placeholder="Your name"
                  disabled={isSaving}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="accountEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmailEdits(e.target.value)}
                  placeholder="Your email"
                  disabled={isSaving}
                  required
                />
              </Form.Group>

              <Button type="submit" disabled={isSaving} style={{ width: '100%' }}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Form>

            <Button
              variant="outline-primary"
              onClick={handleChangePassword}
              style={{ width: '100%', marginTop: '15px' }}
            >
              Change Password
            </Button>

            <Button
              variant="outline-danger"
              onClick={handleSignOut}
              style={{ width: '100%', marginTop: '15px' }}
            >
              Sign Out
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default AccountDetailsPage;
