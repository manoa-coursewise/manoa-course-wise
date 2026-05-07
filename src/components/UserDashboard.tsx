'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import './dashboard.css';

interface Review {
  id: number;
  course: string;
  rating: number;
  comment: string;
}

interface SavedCourse {
  classId: string;
  name: string;
}

export interface User{
  name?: string | null;
  email?: string | null;
}

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Unable to load dashboard data');
        }

        const data = await response.json();
        setReviews(data.reviews ?? []);
        setSavedCourses(data.savedCourses ?? []);
      } catch (err) {
        setError((err as Error)?.message ?? 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Calculate average rating from user reviews
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 'N/A';

  return (
    <div className="dashboard-main course-search-page">
      <div className="container py-4">
        <h2 className="mb-4 fw-bold">Welcome back, {user?.name || user?.email || 'Student'}!</h2>
        {loading && <p>Loading your dashboard...</p>}
        {error && <p className="text-danger">{error}</p>}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 mb-4">
              <h5 className="fw-bold mb-3">Your Course Reviews</h5>
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
            </div>
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold mb-3">Your Stats</h5>
              <p><strong>Reviews Submitted:</strong> {reviews.length}</p>
              <p><strong>Average Rating Given:</strong> {averageRating}</p>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={() => router.push('/dashboard/tutorial')}>
                  Help & Tutorial
                </Button>
                <Button variant="outline-danger" onClick={() => alert('Logging out...')}>
                  Log Out
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold mb-3">Saved Courses</h5>
              <ListGroup variant="flush">
                {savedCourses.length === 0 ? (
                  <ListGroup.Item>No saved courses.</ListGroup.Item>
                ) : (
                  savedCourses.map((course, idx) => (
                    <ListGroup.Item key={idx}>
                      <strong>{course.classId}</strong> — {course.name}
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
