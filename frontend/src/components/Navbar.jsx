import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { UserContext } from "../context/UserContext";

export default function CustomNavbar() {
  const { data } = useContext(UserContext);
  const { currentUser, logout } = data || {};
  const location = useLocation();

  return (
    <Navbar expand="md" style={{ backgroundColor: "#001f3f" }} variant="dark" fixed="top">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          Journey Ease
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">  
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile" active={location.pathname === "/profile"} className="me-4">
                  Profile
                </Nav.Link>

                <Nav.Link as={Link} to="/trip" active={location.pathname === "/trip"} className="me-4">
                  Trips
                </Nav.Link>

                {/* User Greeting */}
                <h5 className="me-3 text-light">
                  {`Hello, ${currentUser.username || "User"}!`}
                </h5>

                {/* Logout Button */}
                <Button variant="danger" size="sm" className="ms-2" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" active={location.pathname === "/"} className="me-4">
                  Home
                </Nav.Link>

                <Button as={Link} to="/register" variant="primary" className="ms-2">
                  Register
                </Button>

                <Button as={Link} to="/login" variant="outline-light" className="ms-2">
                  Login
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
