/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TripContext } from "../context/TripContext";
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";

const Reservation = () => {
    const { tripId } = useParams();
    const tripContext = useContext(TripContext);
    
    if (!tripContext || !tripContext.data) {
        return <Alert variant="danger">Error: Trip Context not found.</Alert>;
    }

    const { 
        reservations = [], 
        fetchReservations, 
        addReservation, 
        updateReservation, 
        deleteReservation, 
        fetchSingleTrip, 
        singleTrip 
    } = tripContext.data;

    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    // 🟢 State for adding a new reservation
    const [formData, setFormData] = useState({
        type: "",
        reservation_date: "",
        cost: ""
    });


    const [updatedType, setUpdatedType] = useState("");
    const [updatedDate, setUpdatedDate] = useState("");
    const [updatedCost, setUpdatedCost] = useState("");

    useEffect(() => {
        if (tripId) {
            setLoading(true);
            fetchReservations(tripId)
                .then(() => setLoading(false))
                .catch(() => setLoading(false));

            fetchSingleTrip(tripId);
        }
    }, [tripId]);

    useEffect(() => {
        if (selectedReservation) {
            setUpdatedType(selectedReservation.reservation_type || "");
            setUpdatedDate(
                selectedReservation.reservation_date 
                    ? new Date(selectedReservation.reservation_date).toISOString().split("T")[0] 
                    : "" // Ensures the date input is properly formatted
            );
            setUpdatedCost(selectedReservation.cost || "");
        }
    }, [selectedReservation]); 
    
    const handleOpenAddModal = () => {
        setFormData({ type: "", reservation_date: "", cost: "" });
        setShowAddModal(true);
    };

    const handleOpenUpdateModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowUpdateModal(true);
    };

    const handleAddReservation = () => {
        if (!formData.type || !formData.reservation_date || !formData.cost) {
            alert("Please fill in all fields.");
            return;
        }
        addReservation(tripId, formData);
        setShowAddModal(false);
    };

    const handleUpdateReservation = () => {
        if (!selectedReservation) return;

        const updatedFields = {
            type: updatedType,
            reservation_date: updatedDate,
            cost: updatedCost
        };

        updateReservation(tripId, selectedReservation.id, updatedFields);
        setShowUpdateModal(false);
    };

    return (
        <div style={{backgroundColor: "#5e9fff"}}>
            <CustomNavbar />
            <Container className="py-5" style={{ minHeight: "90vh", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                <h1 className="text-center text-primary mb-4">
                    {singleTrip ? `Reservations for ${singleTrip.country}` : "Loading trip details..."}
                </h1>
                {loading ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading reservations...</p>
                    </div>
                ) : reservations.length === 0 ? (
                    <Alert variant="warning" className="text-center">
                        No reservations found for this trip.
                    </Alert>
                ) : (
                    <Row className="g-4">
                        {reservations.map((reservation) => (
                            <Col md={6} lg={4} key={reservation.reservation_ref}>
                                <Card className="shadow-sm border-0" style={{ borderRadius: "12px", border: "2px solid #007bff", backgroundColor: "white", padding: "10px" }}>
                                    <Card.Body>
                                        <Card.Title className="fw-bold text-primary" style={{ fontSize: "1.4rem" }}>
                                            {reservation.reservation_type}
                                        </Card.Title>
                                        <hr />
                                        <Card.Text className="text-muted"><strong>Reference:</strong> {reservation.reservation_ref}</Card.Text>
                                        <Card.Text className="text-muted"><strong>Date:</strong> {new Date(reservation.reservation_date).toLocaleDateString()}</Card.Text>
                                        <Card.Text className="text-muted"><strong>Cost:</strong> ${reservation.cost}</Card.Text>
                                        <Button variant="primary" className="me-2 w-100" onClick={() => handleOpenUpdateModal(reservation)}>
                                            Update
                                        </Button>
                                        <Button variant="danger" className="w-100 mt-2" onClick={() => deleteReservation(tripId, reservation.id)}>
                                            Cancel
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
                <div className="text-center mt-4">
                    <Button variant="success" style={{ borderRadius: "8px", fontSize: "18px" }} onClick={handleOpenAddModal}>
                        + Add New Reservation
                    </Button>
                </div>
            </Container>

            {/* Add Reservation Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="type" 
                                value={formData.type} 
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date of Reservation</Form.Label>
                            <Form.Control 
                                type="date" 
                                name="reservation_date" 
                                value={formData.reservation_date} 
                                onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Cost</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="cost" 
                                value={formData.cost} 
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
                    <Button variant="success" onClick={handleAddReservation}>Add</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Reservation Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={updatedType} 
                                onChange={(e) => setUpdatedType(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date of Reservation</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={updatedDate} 
                                onChange={(e) => setUpdatedDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Cost</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={updatedCost} 
                                onChange={(e) => setUpdatedCost(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateReservation}>Update</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Reservation;
