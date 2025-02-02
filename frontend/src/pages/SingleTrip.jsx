import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TripContext } from "../context/TripContext";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
import UpdateTripModal from "../components/UpdateTripModal"; // ✅ Import the new modal

const SingleTrip = () => {
    const { tripId } = useParams();
    const { fetchSingleTrip, singleTrip, updateTrip, deleteTrip, navigateToReservations } = useContext(TripContext)?.data || {};
    const [showModal, setShowModal] = useState(false);
    const [country, setCountry] = useState('');
    const [tripActivity, setTripActivity] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        fetchSingleTrip(tripId);
    }, [tripId]);
    
    useEffect(() => {
        if (singleTrip) {
            setCountry(singleTrip.country);
            setTripActivity(singleTrip.trip_activity);
            setDuration(singleTrip.duration);
        }
    }, [singleTrip]);

    const handleUpdateTrip = () => {
        updateTrip(tripId, country, tripActivity, duration);
        setShowModal(false);
    };

    const handleDeleteTrip = () => {
        if (window.confirm("Are you sure you want to cancel this trip?")) {
            deleteTrip(tripId);
        }
    };

    return (
        <div>
            <CustomNavbar />
            <Container 
                className="py-5 d-flex justify-content-center align-items-center" 
                style={{
                    minHeight: "90vh",
                }}
            >
                {singleTrip === null ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading trip details...</p>
                    </div>
                ) : !singleTrip ? (
                    <Alert variant="danger" className="text-center">
                        Trip not found. Please check the trip reference.
                    </Alert>
                ) : (
                    <Card 
                        className="shadow-lg p-4 w-100 text-center" 
                        style={{ 
                            maxWidth: "600px",
                            borderRadius: "12px",
                            background: "#ffffff",
                            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <Card.Body>
                            <Card.Title 
                                className="fw-bold mb-3" 
                                style={{ fontSize: "2rem", color: "#007bff" }}
                            >
                                {singleTrip.country}
                            </Card.Title>
                            <hr />
                            <Card.Text className="text-muted">
                                <strong>Trip reference:</strong> {singleTrip.trip_ref}
                            </Card.Text>
                            <Card.Text className="text-muted">
                                <strong>Trip Activity:</strong> {singleTrip.trip_activity}
                            </Card.Text>
                            <Card.Text className="text-muted">
                                <strong>Duration:</strong> {singleTrip.duration}
                            </Card.Text>

                            <div className="mt-4">
                                <Button
                                    variant="success"
                                    className="w-100 mb-2"
                                    style={{
                                        fontSize: "1rem",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        transition: "0.3s ease-in-out"
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                    onClick={() => navigateToReservations(tripId)}
                                >
                                    Reserve This Trip
                                </Button>

                                <Button
                                    variant="primary"
                                    className="w-100 mb-2"
                                    style={{
                                        fontSize: "1rem",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        transition: "0.3s ease-in-out"
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                    onClick={() => setShowModal(true)}
                                >
                                    Update Trip
                                </Button>

                                <Button
                                    variant="danger"
                                    className="w-100"
                                    style={{
                                        fontSize: "1rem",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        transition: "0.3s ease-in-out"
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                    onClick={handleDeleteTrip}
                                >
                                    Cancel Trip
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </Container>

            <UpdateTripModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                country={country}
                setCountry={setCountry}
                tripActivity={tripActivity}
                setTripActivity={setTripActivity}
                duration={duration}
                setDuration={setDuration}
                handleUpdateTrip={handleUpdateTrip}
            />
        </div>
    );
};

export default SingleTrip;
