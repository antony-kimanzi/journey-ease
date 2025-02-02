/* eslint-disable react/prop-types */
import { Modal, Button, Form } from "react-bootstrap";


const UpdateTripModal = ({ show, handleClose, country, setCountry, tripActivity, setTripActivity, duration, setDuration, handleUpdateTrip }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Trip</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Country</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Trip Activity</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={tripActivity} 
                            onChange={(e) => setTripActivity(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Duration(days, weeks, months, years)</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)} 
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleUpdateTrip}>Update</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateTripModal;
