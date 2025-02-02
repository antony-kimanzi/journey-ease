import { useContext, useEffect, useState } from "react";
import { TripContext } from "../context/TripContext";
import CustomNavbar from "../components/Navbar";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import AddTripModal from "../components/AddTripModal";

const Trip = () => {
    const { data } = useContext(TripContext);
    const { trips, fetchTrips, addTrip, navigateToTrip } = data;

    const [showModal, setShowModal] = useState(false);
    const [onTripChange, setOnTripChange] = useState(false); 

    useEffect(() => {
        fetchTrips();
    }, [onTripChange]);

    const handleAddTrip = (tripData) => {
        addTrip(tripData).then(() => {
            setOnTripChange(!onTripChange);
            setShowModal(false);
        });
    };

    return (
        <div>
            <CustomNavbar />
            <Container 
                className="py-5" 
                style={{ 
                    minHeight: "90vh"
                }}
            >
                <h1 className="text-center text-dark mb-4">Available Trips</h1>

                {/* Add Trip Button */}
                <div className="d-flex justify-content-center mb-4">
                    <Button 
                        variant="success" 
                        size="lg" 
                        className="shadow-sm"
                        style={{
                            borderRadius: "8px",
                            transition: "all 0.3s ease-in-out"
                        }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                        onClick={() => setShowModal(true)}
                    >
                        + Add Trip
                    </Button>
                </div>

                {/* Add Trip Modal */}
                <AddTripModal 
                    show={showModal} 
                    handleClose={() => setShowModal(false)} 
                    handleAddTrip={handleAddTrip} 
                />

                {trips && trips.length > 0 ? (
                    <Row className="g-4">
                        {trips.map((trip) => (
                            <Col md={6} lg={4} key={trip.trip_ref}>
                                <Card 
                                    border="info"
                                    bg="light" 
                                    text="dark"
                                    className="shadow-sm border-0"
                                    style={{
                                        borderRadius: "12px",
                                        transition: "all 0.3s ease-in-out",
                                        cursor: "pointer",
                                        border: "3px solid #007bff",
                                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.1)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = "0px 5px 10px rgba(0, 0, 0, 0.05)";
                                    }}
                                    onClick={() => navigateToTrip(trip.id)}
                                >
                                    <Card.Body>
                                        <Card.Title 
                                            className="fw-bold text-primary"
                                            style={{ fontSize: "1.5rem" }}
                                        >
                                            {trip.country}
                                        </Card.Title>
                                        <hr style={{ borderTop: "1px solid #ccc" }} />
                                        <Card.Text>
                                            <strong>Trip Id:</strong> {trip.id}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Activity:</strong> {trip.trip_activity}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Duration:</strong> {trip.duration}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">No trips available.</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Trip;
