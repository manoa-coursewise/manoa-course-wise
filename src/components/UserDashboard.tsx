'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import './dashboard.css';

interface Review {
  id: number;
  course: string;
  rating: number;
  comment: string;
}

export interface User{
  name?: string | null;
  email?: string | null;
}

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      // Simulate fetching data or any async operation
      const fetchedReviews = [
        { id: 1, course: 'ICS 311', rating: 5, comment: 'Great course with engaging lectures!' },
        { id: 2, course: 'MATH 242', rating: 4, comment: 'Challenging but rewarding.' },
      ];

      const fetchedSavedCourses = ['ECON 300', 'BIOL 172'];

      setReviews(fetchedReviews);
      setSavedCourses(fetchedSavedCourses);
    }

    fetchUserData();
  }, []);

  // Calculate average rating from user reviews
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 'N/A';

  return (
    <main className="dashboard-main">
      <Container>
        <h2 className="mb-4">Welcome back, {user?.name || user?.email || 'Student'}!</h2>

        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Your Course Reviews</Card.Header>
              <ListGroup variant="flush">
                {reviews.length === 0 ? (
                  <ListGroup.Item>No reviews yet.</ListGroup.Item>
                ) : (
                  reviews.map(({ id, course, rating, comment }) => (
                    <ListGroup.Item key={id}>
                      <strong>{course}</strong> — Rating: {rating} / 5
                      <p className="mb-0">{comment}</p>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Saved Courses</Card.Header>
              <ListGroup variant="flush">
                {savedCourses.length === 0 ? (
                  <ListGroup.Item>No saved courses.</ListGroup.Item>
                ) : (
                  savedCourses.map((course, idx) => (
                    <ListGroup.Item key={idx}>{course}</ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>

            <Card>
              <Card.Header>Your Stats</Card.Header>
              <Card.Body>
                <p><strong>Reviews Submitted:</strong> {reviews.length}</p>
                <p><strong>Average Rating Given:</strong> {averageRating}</p>
                <Button variant="outline-danger" onClick={() => alert('Logging out...')}>
                  Log Out
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default UserDashboard;
