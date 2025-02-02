import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { UserContext } from "../context/UserContext";

export default function CustomNavbar() {
  const { data } = useContext(UserContext);
  const { currentUser, logout } = data || {};
  const location = useLocation();

  return (
    <Navbar
      expand="md"
      variant="dark"
      fixed="top"
      style={{
        backgroundColor: "#001f3f",
        width: "100vw", // Full width
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-light">
          Journey Ease
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {currentUser ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={`me-4 ${location.pathname === "/profile" ? "text-warning fw-bold" : "text-light"}`}
                >
                  Profile
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/trip"
                  className={`me-4 ${location.pathname === "/trip" ? "text-warning fw-bold" : "text-light"}`}
                >
                  Trips
                </Nav.Link>

                {/* User Greeting */}
                <h5 className="me-3 text-light mb-0">
                  {`Hello, ${currentUser.username || "User"}!`}
                </h5>

                {/* Logout Button */}
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  style={{ fontWeight: "bold", borderRadius: "6px" }}
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`me-4 ${location.pathname === "/" ? "text-warning fw-bold" : "text-light"}`}
                >
                  Home
                </Nav.Link>

                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  className="ms-2"
                  style={{ fontWeight: "bold", borderRadius: "6px" }}
                >
                  Register
                </Button>

                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="ms-2"
                  style={{ fontWeight: "bold", borderRadius: "6px" }}
                >
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
