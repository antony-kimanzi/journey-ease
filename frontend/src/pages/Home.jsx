import { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { data } = useContext(UserContext);
  const { currentUser } = data || {};

  return (
    <div style={{ minHeight: "100vh", color: "#001f3f" }}> {/* Removed background colors & set text color */}
      <CustomNavbar />

      {/* Hero Section */}
      <div
        className="d-flex align-items-center justify-content-center text-center position-relative"
        style={{
          backgroundImage: "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
          color: "#001f3f",
        }}
      >
        {/* Gradient Overlay */}
        <div className="position-absolute w-100 h-100" ></div>

        <Container className="position-relative">
          <h1 className="fw-bold display-4">Welcome to Journey Ease</h1>
          <p className="lead" style={{lineHeight:"2.4rem", fontWeight:"initial"}}>
            Your ultimate travel companion! Book trips, track reservations, and explore amazing destinations hassle-free.  
            Whether you&apos;re planning a solo adventure, a family vacation, or a business trip, Journey Ease makes it simple and convenient.  
            Enjoy seamless bookings, real-time trip updates, and secure transactions—all in one place.  
            Discover new destinations, manage your travel plans effortlessly, and make unforgettable memories with ease!
          </p>

          {/* Conditional Buttons */}
          {!currentUser ? (
            <div className="mt-4">
              <Button as={Link} to="/login" variant="primary" size="lg" className="me-3 px-4 py-2 fw-bold hover-scale">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline-primary" size="lg" className="px-4 py-2 fw-bold hover-scale">
                Register
              </Button>
            </div>
          ) : (
            <h4 className="text-light mt-4">You&apos;re logged in! Start exploring now.</h4>
          )}
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center text-dark fw-bold mb-4">Why Choose Journey Ease?</h2>
        <Row className="justify-content-center">
          {[
            { title: "Explore", text: "Discover breathtaking destinations worldwide.", color: "#007bff" },
            { title: "Manage", text: "Easily track and manage your reservations.", color: "#17a2b8" },
            { title: "Secure", text: "Safe & seamless booking process.", color: "#ffc107" },
          ].map((feature, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="shadow-lg border-0 feature-card text-center p-4">
                <h4 style={{ color: feature.color }} className="mb-3">{feature.title}</h4>
                <p className="text-muted">{feature.text}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Extra Styles */}
      <style>
        {`
          .hover-scale {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-scale:hover {
            transform: scale(1.05);
          }

          .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            border-radius: 12px;
            background-color: white; /* Remove colored backgrounds */
          }

          .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </div>
  );
}
