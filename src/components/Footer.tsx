import { Container, Row, Col } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto app-footer">
    <Container>
      <Row className="app-footer-main g-4">
        <Col md={3} className="app-footer-section">
          <h5 className="app-footer-heading">Manoa CourseWise</h5>
          <p className="app-footer-copy mb-0">
            A student-focused review platform for UH Manoa courses and professors.
            Search classes, read real feedback, and share your experience.
          </p>
        </Col>

        <Col xs={6} md={2} className="app-footer-section">
          <h6 className="app-footer-subheading">Explore</h6>
          <ul className="app-footer-list">
            <li><a className="app-footer-link" href="/courses/search">Courses</a></li>
            <li><a className="app-footer-link" href="/professors">Professors</a></li>
            <li><a className="app-footer-link" href="/reviews/submit">Submit Review</a></li>
          </ul>
        </Col>

        <Col xs={6} md={2} className="app-footer-section">
          <h6 className="app-footer-subheading">Account</h6>
          <ul className="app-footer-list">
            <li><a className="app-footer-link" href="/dashboard">Dashboard</a></li>
            <li><a className="app-footer-link" href="/auth/signin">Sign In</a></li>
            <li><a className="app-footer-link" href="/dashboard/tutorial">Tutorial</a></li>
          </ul>
        </Col>

        <Col xs={6} md={3} className="app-footer-section">
          <h6 className="app-footer-subheading">Team</h6>
          <ul className="app-footer-team-list">
            <li>Noah Nguyen</li>
            <li>Ryan Stuckey</li>
            <li>Jaymond Guan</li>
            <li>Jon Crabtree</li>
          </ul>
        </Col>

        <Col xs={6} md={2} className="app-footer-section app-footer-project">
          <h6 className="app-footer-subheading">Project</h6>
          <a
            className="app-footer-github-btn"
            href="https://github.com/manoa-coursewise/manoa-course-wise"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repo
          </a>
        </Col>
      </Row>

      <div className="app-footer-bottom">
        <span>{new Date().getFullYear()} Manoa CourseWise</span>
        <span className="app-footer-sep">|</span>
        <span>UH Manoa</span>
      </div>
    </Container>
  </footer>
);

export default Footer;
