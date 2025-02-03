import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function Register() {
  const { data } = useContext(AuthContext);
  const { addUser } = data || {};

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (addUser) {
      addUser(username, email, password, phoneNumber);
      navigate("/login"); // Redirect to login after successful registration
    } else {
      console.error("addUser function is undefined! Check AuthContext.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      {/* Logo */}
      <div className="mb-4" onClick={() => navigate("/")}>
        <h3>Journey Ease</h3>
      </div>

      {/* Register Card */}
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center text-primary mb-3">Register</h2>
          <p className="text-center text-muted">Create your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Register Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat your password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="success" className="w-100">
              Sign Up
            </Button>
          </Form>

          {/* Extra Links */}
          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <span className="text-primary cursor-pointer" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
