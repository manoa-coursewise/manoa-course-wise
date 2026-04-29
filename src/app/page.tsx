'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import './landing.css';

/** The Home page. */
const Home = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const destination = trimmedQuery ? `/courses/search?query=${encodeURIComponent(trimmedQuery)}` : '/courses/search';
    router.push(destination);
  };

  return (
  <main>
    {/* Hero Section */}
    <section className="hero-section">
      <Container>
        <div className="hero-content">
          <h1 className="hero-title">Honest Course Reviews & Smarter Scheduling</h1>
          <p className="hero-subtitle">for UH Mānoa</p>

          {/* Search Bar */}
          <div className="search-container mt-5">
            <Form className="search-form" onSubmit={handleSubmit}>
              <Form.Group className="search-group">
                <Form.Control
                  type="text"
                  placeholder="Search courses or professors... (e.g. ICS 311, MATH 242)"
                  className="search-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search courses or professors"
                />
                <Button className="search-button" type="submit">
                  <Search size={20} />
                  Search
                </Button>
              </Form.Group>
            </Form>
            <div className="popular-searches mt-3">
              <p><strong>Popular:</strong> ICS 311 • MATH 242 • ECON 300 • BIOL 172</p>
            </div>
          </div>
        </div>
      </Container>
    </section>

    {/* Statistics Section */}
    <section className="stats-section">
      <Container>
        <Row className="text-center">
          <Col md={3} className="stat-column mb-4 mb-md-0">
            <div className="stat-value">1,847</div>
            <div className="stat-label">Courses Reviewed</div>
          </Col>
          <Col md={3} className="stat-column mb-4 mb-md-0">
            <div className="stat-value">12,459</div>
            <div className="stat-label">Student Reviews</div>
          </Col>
          <Col md={3} className="stat-column mb-4 mb-md-0">
            <div className="stat-value">4.6</div>
            <div className="stat-label">Average Rating</div>
          </Col>
          <Col md={3} className="stat-column">
            <div className="stat-value">87%</div>
            <div className="stat-label">Would Take Again</div>
          </Col>
        </Row>
      </Container>
    </section>
  </main>
);
}

export default Home;