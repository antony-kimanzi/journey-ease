import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer 
      className="text-light text-center py-3"
      style={{
        backgroundColor: "#001f3f", // Dark blue background
        fontSize: "14px",
        color: "#ffffff",
        marginTop: "auto" // Push footer to bottom if content is short
      }}
    >
      <Container>
        <Row>
          <Col>
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Journey Ease. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
