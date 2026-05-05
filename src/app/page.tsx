import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import HeroSearch from '@/components/HeroSearch';
import './landing.css';

const Home = async () => {
  const [courseCount, professorCount, reviewCount, avgRatingResult] = await Promise.all([
    prisma.course.count(),
    prisma.professor.count(),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
  ]);

  const avgRating = avgRatingResult._avg.rating
    ? avgRatingResult._avg.rating.toFixed(1)
    : '—';

  return (
  <main>
    {/* Hero Section */}
    <section className="hero-section">
      <Container>
        <div className="hero-content">
          <h1 className="hero-title">Honest Course Reviews</h1>
          <p className="hero-subtitle">for UH Mānoa</p>
          <HeroSearch />
        </div>
      </Container>
    </section>

    {/* Statistics Section */}
    <section className="stats-section">
      <Container>
        <Row className="text-center">
          <Col md={3} className="stat-column mb-4 mb-md-0">
            <div className="stat-value">{courseCount}</div>
            <div className="stat-label">Courses Supported</div>
          </Col>
          <Col md={3} className="stat-column mb-4 mb-md-0">
            <div className="stat-value">{professorCount}</div>
            <div className="stat-label">Professors Listed</div>
          </Col>
          <Col md={3} className="stat-column mb-4 mb-md-0">
            <div className="stat-value">{reviewCount}</div>
            <div className="stat-label">Student Reviews</div>
          </Col>
          <Col md={3} className="stat-column">
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Average Rating</div>
          </Col>
        </Row>
      </Container>
    </section>
  </main>
);
}

export default Home;