import { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { TripContext } from "../context/TripContext";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const AddTripModal = ({ show, handleClose }) => {
    const { data } = useContext(TripContext);
    const { addTrip } = data;

    const [country, setCountry] = useState('');
    const [tripActivity, setTripActivity] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!country || !tripActivity || !duration) {
            toast.error("Please fill in all fields.");
            return;
        }
        
        await addTrip(country, tripActivity, duration);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Trip</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control 
                            type="text"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Trip Activity</Form.Label>
                        <Form.Control 
                            type="text"
                            name="trip_activity"
                            value={tripActivity}
                            onChange={(e) => setTripActivity(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Duration (days, weeks, months, years)</Form.Label>
                        <Form.Control 
                            type="text"
                            name="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Trip
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddTripModal;
