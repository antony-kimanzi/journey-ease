import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Spinner, Row, Col, Image } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
import UpdateProfileModal from "../components/UpdateProfileModal";

const Profile = () => {
  const { data } = useContext(UserContext);
  const { currentUser, updateUser, deleteUser } = data || {};
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // Redirect to login if user isn't logged in
    }
  }, [currentUser, navigate]);

  return (
    <div>
      <CustomNavbar />
      <Container 
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card 
              className="shadow-lg border-0 p-4"
              style={{
                borderRadius: "12px",
                padding: "30px",
                background: "#ffffff",
                boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Body className="text-center">
                {currentUser ? (
                  <>
                    {/* Profile Image */}
                    <Image 
                      src="/public/avatar-profile.png" 
                      roundedCircle 
                      alt="Profile Avatar"
                      className="mb-3"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "3px solid #007bff",
                      }}
                    />

                    <Card.Title 
                      as="h2" 
                      className="fw-bold text-primary"
                    >
                      {currentUser.username}
                    </Card.Title>
                    <hr className="my-4" />

                    <p className="text-muted mb-2">
                      <strong>Name:</strong> {currentUser.username}
                    </p>
                    <p className="text-muted mb-2">
                      <strong>Email:</strong> {currentUser.email}
                    </p>
                    <p className="text-muted mb-4">
                      <strong>Phone Number:</strong> {currentUser.phone_number}
                    </p>

                    {/* Update Profile Button */}
                    <Button
                      onClick={() => setShowModal(true)}
                      variant="outline-primary"
                      size="lg"
                      className="w-100 mb-3"
                      style={{
                        transition: "all 0.3s ease-in-out",
                      }}
                      onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                      onMouseOut={(e) => e.target.style.transform = "translateY(0px)"}
                    >
                      Update Profile
                    </Button>

                    {/* Delete Account Button */}
                    <Button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
                          deleteUser();
                        }
                      }}
                      variant="outline-danger"
                      size="lg"
                      className="w-100"
                      style={{
                        transition: "all 0.3s ease-in-out",
                      }}
                      onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                      onMouseOut={(e) => e.target.style.transform = "translateY(0px)"}
                    >
                      Delete Account
                    </Button>
                  </>
                ) : (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Update Profile Modal */}
      <UpdateProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        currentUser={currentUser}
        updateUser={updateUser}
      />
    </div>
  );
};

export default Profile;
