'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  if (status === 'loading') return null;
  const currentUser = session?.user?.email;
  const role = session?.user?.role;
  
  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="fw-bold" style={{ fontSize: '1.5rem' }}>
          Mānoa CourseWise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#search-courses" className="mx-2">
              Search Courses
            </Nav.Link>
            <Nav.Link href="#professors" className="mx-2">
              Professors
            </Nav.Link>
            <Nav.Link href="#schedule-builder" className="mx-2">
              Schedule Builder
            </Nav.Link>
            <Nav.Link href="#submit-review" className="mx-2">
              Submit Review
            </Nav.Link>
            {currentUser && role === 'ADMIN' && (
              <Nav.Link id="admin-stuff-nav" href="/admin" active={pathName === '/admin'} className="mx-2">
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser} align="end">
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link id="login-btn" href="/auth/signin" className="btn btn-outline-primary mx-2">
                Log In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
