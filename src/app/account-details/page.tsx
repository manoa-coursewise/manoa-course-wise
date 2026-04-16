
'use client';

import { useState, FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const AccountDetailsMock = () => {
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);

    // Simulate saving delay
    setTimeout(() => {
      setIsSaving(false);
      setMessage('Account details updated successfully!');
    }, 1000);
  };

  const handleSignOut = () => {
    alert('Sign out clicked (mock)');
  };

  return (
    <main className="dashboard-main" style={{ padding: '40px 0' }}>
      <Container style={{ maxWidth: '480px' }}>
        <Card>
          <Card.Header>
            <h2>Account Details (Mockup)</h2>
          </Card.Header>
          <Card.Body>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="accountName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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

export default AccountDetailsMock;