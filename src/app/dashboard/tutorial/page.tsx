'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const TutorialPage = () => {
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
    return null;
  }

  const user = session.user as { name?: string | null; email?: string | null };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <main className="dashboard-main">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Help & Tutorial</h2>
          <Button 
            style={{ backgroundColor: '#20a084', border: 'none' }} 
            onClick={handleBackToDashboard}
          >
            ← Back to Dashboard
          </Button>
        </div>

        <Row>
          <Col lg={8}>
            {/* Getting Started */}
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h4 className="mb-0" style={{ color: 'white' }}>🚀 Getting Started</h4>
              </Card.Header>
              <Card.Body>
                <h5 style={{ color: '#1a5f5f' }}>Welcome to Mānoa CourseWise, {user?.name || user?.email || 'Student'}!</h5>
                <p>
                  This tutorial will help you navigate the platform and make the most of its features.
                </p>
                <ul>
                  <li><strong>Browse Courses</strong> - Search and explore courses at UH Mānoa</li>
                  <li><strong>Read Reviews</strong> - See honest feedback from other students</li>
                  <li><strong>Submit Reviews</strong> - Share your experience to help others</li>
                  <li><strong>Track Your Reviews</strong> - View your submitted reviews in your dashboard</li>
                </ul>
              </Card.Body>
            </Card>

            {/* Finding Courses */}
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h4 className="mb-0" style={{ color: 'white' }}>🔍 How to Find Courses</h4>
              </Card.Header>
              <Card.Body>
                <h5 style={{ color: '#1a5f5f' }}>Method 1: Search Bar</h5>
                <p>Use the search bar on the landing page to quickly find courses by:</p>
                <ul>
                  <li>Course code (e.g., &quot;ICS 311&quot;)</li>
                  <li>Course name (e.g., &quot;Algorithms&quot;)</li>
                  <li>Professor name</li>
                </ul>

                <h5 style={{ color: '#1a5f5f' }}>Method 2: Browse All Courses</h5>
                <p>
                  Click <strong>&quot;Search Courses&quot;</strong> in the navigation bar to see all available courses.
                  Each course card shows:
                </p>
                <ul>
                  <li>Course code and title</li>
                  <li>Professor name</li>
                  <li>Average rating (0-5 stars)</li>
                  <li>Number of reviews</li>
                  <li>Difficulty, Workload, and Clarity ratings</li>
                  <li>Top tags (e.g., &quot;Homework heavy&quot;, &quot;Challenging&quot;)</li>
                </ul>
              </Card.Body>
            </Card>

            {/* Reading Reviews */}
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h4 className="mb-0" style={{ color: 'white' }}>📖 Reading Course Reviews</h4>
              </Card.Header>
              <Card.Body>
                <p>Click on any course card to view its detailed page, which shows:</p>
                <ul>
                  <li><strong>Course Information</strong> - Code, name, and all professors</li>
                  <li><strong>Overall Rating</strong> - Average rating from all students</li>
                  <li><strong>Metrics</strong> - Average difficulty, workload, and clarity (1-5 scale)</li>
                  <li><strong>Tags</strong> - Most common course characteristics</li>
                  <li><strong>All Reviews</strong> - Full list of student reviews with ratings and comments</li>
                </ul>
                <p className="text-muted">
                  <em>Tip: Check the semester taken to see if reviews are from recent students!</em>
                </p>
              </Card.Body>
            </Card>

            {/* Submitting Reviews */}
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h4 className="mb-0" style={{ color: 'white' }}>✍️ How to Submit a Review</h4>
              </Card.Header>
              <Card.Body>
                <h5 style={{ color: '#1a5f5f' }}>Step 1: Navigate to Submit Review</h5>
                <p>Click <strong>&quot;Submit Review&quot;</strong> in the navigation bar.</p>

                <h5 style={{ color: '#1a5f5f' }}>Step 2: Select Course & Professor</h5>
                <ul>
                  <li>Choose a course from the dropdown</li>
                  <li>Select the professor you had</li>
                </ul>

                <h5 style={{ color: '#1a5f5f' }}>Step 3: Choose Semester</h5>
                <p>Select the semester when you took the course (Fall 2023 - Spring 2026).</p>

                <h5 style={{ color: '#1a5f5f' }}>Step 4: Rate the Course</h5>
                <p>Provide ratings on a 1-5 scale for:</p>
                <ul>
                  <li><strong>Overall Rating</strong> - Your overall impression</li>
                  <li><strong>Difficulty</strong> - How challenging the material was</li>
                  <li><strong>Workload</strong> - Amount of work required</li>
                  <li><strong>Clarity</strong> - How well the material was explained</li>
                </ul>

                <h5 style={{ color: '#1a5f5f' }}>Step 5: Write Your Review</h5>
                <p>Add a detailed written review (required). Share your experience!</p>

                <h5 style={{ color: '#1a5f5f' }}>Step 6: Add Tags</h5>
                <p>Select one or more tags that describe the course:</p>
                <ul>
                  <li>Homework heavy</li>
                  <li>Lecture heavy</li>
                  <li>Exam heavy</li>
                  <li>Group projects</li>
                  <li>Challenging</li>
                  <li>Easy grading</li>
                </ul>

                <h5 style={{ color: '#1a5f5f' }}>Step 7: Choose Anonymous</h5>
                <p>Check the anonymous box if you don&apos;t want your email to be displayed.</p>

                <div style={{ 
                  backgroundColor: '#d4edda', 
                  border: '1px solid #c3e6cb', 
                  borderRadius: '4px', 
                  padding: '12px',
                  color: '#155724'
                }}>
                  <strong>💡 Pro Tip:</strong> Your review helps future students make informed decisions!
                </div>
              </Card.Body>
            </Card>

            {/* Understanding Ratings */}
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h4 className="mb-0" style={{ color: 'white' }}>⭐ Understanding the Ratings</h4>
              </Card.Header>
              <Card.Body>
                <p>Each course has several ratings to help you understand what to expect:</p>
                
                <Row>
                  <Col md={6}>
                    <Card bg="light">
                      <Card.Body>
                        <h5 style={{ color: '#1a5f5f' }}>Overall Rating</h5>
                        <p className="mb-0">The average rating from all student reviews (0-5 stars).</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card bg="light">
                      <Card.Body>
                        <h5 style={{ color: '#1a5f5f' }}>Difficulty</h5>
                        <p className="mb-0">How challenging the course material is (1 = Easy, 5 = Very Hard).</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Card bg="light">
                      <Card.Body>
                        <h5 style={{ color: '#1a5f5f' }}>Workload</h5>
                        <p className="mb-0">Amount of work required (1 = Light, 5 = Heavy).</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card bg="light">
                      <Card.Body>
                        <h5 style={{ color: '#1a5f5f' }}>Clarity</h5>
                        <p className="mb-0">How well the material is explained (1 = Confusing, 5 = Clear).</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* FAQ */}
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h4 className="mb-0" style={{ color: 'white' }}>❓ Frequently Asked Questions</h4>
              </Card.Header>
              <Card.Body>
                <h5 style={{ color: '#1a5f5f' }}>Do I need an account to browse courses?</h5>
                <p>No! You can browse courses and read reviews without signing in. However, you need an account to submit reviews.</p>

                <h5 style={{ color: '#1a5f5f' }}>How do I create an account?</h5>
                <p>Click <strong>&quot;Login&quot;</strong> in the navigation bar, then click <strong>&quot;Sign Up&quot;</strong> at the bottom of the form.</p>

                <h5 style={{ color: '#1a5f5f' }}>Can I edit or delete my reviews?</h5>
                <p>Currently, you can view your reviews in your dashboard. Contact an administrator if you need to modify or remove a review.</p>

                <h5 style={{ color: '#1a5f5f' }}>Are my reviews anonymous?</h5>
                <p>You can choose to make your review anonymous by checking the anonymous option when submitting. Anonymous reviews won&apos;t show your email.</p>

                <h5 style={{ color: '#1a5f5f' }}>What do the tags mean?</h5>
                <ul>
                  <li><strong>Homework heavy</strong> - Lots of homework assignments</li>
                  <li><strong>Lecture heavy</strong> - Focus on lectures</li>
                  <li><strong>Exam heavy</strong> - Many exams</li>
                  <li><strong>Group projects</strong> - Group work required</li>
                  <li><strong>Challenging</strong> - Difficult material</li>
                  <li><strong>Easy grading</strong> - Generous grading</li>
                </ul>

                <h5 style={{ color: '#1a5f5f' }}>How are ratings calculated?</h5>
                <p>Ratings are the average of all student submissions. The more reviews a course has, the more accurate the ratings.</p>
              </Card.Body>
            </Card>

            {/* Quick Reference */}
            <Card>
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h4 className="mb-0" style={{ color: 'white' }}>📋 Quick Reference</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5 style={{ color: '#1a5f5f' }}>Navigation Links</h5>
                    <ul>
                      <li><strong>Search Courses</strong> - Browse all courses</li>
                      <li><strong>Submit Review</strong> - Add a new review</li>
                      <li><strong>My Dashboard</strong> - View your reviews</li>
                      <li><strong>Help & Tutorial</strong> - This page</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h5 style={{ color: '#1a5f5f' }}>Rating Scale</h5>
                    <ul>
                      <li>⭐ 1 - Poor</li>
                      <li>⭐⭐ 2 - Fair</li>
                      <li>⭐⭐⭐ 3 - Good</li>
                      <li>⭐⭐⭐⭐ 4 - Very Good</li>
                      <li>⭐⭐⭐⭐⭐ 5 - Excellent</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <Card className="mb-4 sticky-top" style={{ top: '20px' }}>
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h5 className="mb-0" style={{ color: 'white' }}>📚 Quick Links</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  <button
                    className="list-group-item list-group-item-action"
                    style={{ color: '#20a084' }}
                    onClick={() => router.push('/courses/search')}
                  >
                    🔍 Browse Courses
                  </button>
                  <button
                    className="list-group-item list-group-item-action"
                    style={{ color: '#20a084' }}
                    onClick={() => router.push('/reviews/submit')}
                  >
                    ✍️ Submit a Review
                  </button>
                  <button
                    className="list-group-item list-group-item-action"
                    style={{ color: '#20a084' }}
                    onClick={handleBackToDashboard}
                  >
                    📊 My Dashboard
                  </button>
                </div>
              </Card.Body>
            </Card>

            <Card className="sticky-top" style={{ top: '220px' }}>
              <Card.Header style={{ backgroundColor: '#1a5f5f' }}>
                <h5 className="mb-0" style={{ color: 'white' }}>💬 Need Help?</h5>
              </Card.Header>
              <Card.Body>
                <p>If you have questions or encounter issues:</p>
                <ul>
                  <li>Contact the site administrator</li>
                  <li>Check the error messages for guidance</li>
                  <li>Review this tutorial again</li>
                </ul>
                <Button variant="outline-primary" className="w-100" onClick={handleBackToDashboard}>
                  Return to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default TutorialPage;