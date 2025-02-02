import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { data } = useContext(UserContext); 
  const { login } = data || {}; // ✅ Extract `login` function properly

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (login) {
      login(email, password);
    } else {
      console.error("Login function is undefined! Check UserContext.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh"}}>
      {/* Logo */}
      <div className="mb-4" onClick={() => navigate("/")}>
        <h3>Journey Ease</h3>
      </div>

      {/* Sign-In Card */}
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center text-primary mb-3">Login</h2>
          <p className="text-center text-muted">Welcome, please login to continue</p>

          {/* Sign-In Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Login
            </Button>
          </Form>

          {/* Extra Links */}
          <div className="text-center mt-3">
            <p>
              Don’t have an account?{" "}
              <span className="text-primary cursor-pointer" onClick={() => navigate("/register")}>
                Register
              </span>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
