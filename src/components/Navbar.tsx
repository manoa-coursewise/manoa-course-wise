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
    <Navbar expand="lg" sticky="top" className="app-navbar shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="fw-bold app-navbar-brand" style={{ fontSize: '1.5rem' }}>
          Mānoa CourseWise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/courses/search" className="mx-2 app-nav-link">
              Search Courses
            </Nav.Link>
            <Nav.Link href="#professors" className="mx-2 app-nav-link">
              Professors
            </Nav.Link>
            <Nav.Link href="#schedule-builder" className="mx-2 app-nav-link">
              Schedule Builder
            </Nav.Link>
            <Nav.Link href="/reviews/submit" className="mx-2 app-nav-link">
              Submit Review
            </Nav.Link>
           ({currentUser &&  role === 'USER' &&  (<Nav.Link href = "/dashboard" className="mx-2 app-nav-link">
            My Dashboard
            </Nav.Link>)})
            {currentUser && role === 'ADMIN' && (
              <Nav.Link id="admin-stuff-nav" href="/admin" active={pathName === '/admin'} className="mx-2 app-nav-link">
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser} align="end">
                <NavDropdown.Item id="login-dropdown-account-details" href="/account-details">
                  <Lock />
                  Account Details
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link id="login-btn" href="/auth/signin" className="btn btn-outline-primary mx-2 app-login-link">
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
