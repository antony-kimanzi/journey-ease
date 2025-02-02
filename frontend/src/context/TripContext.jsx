/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
    const { authToken } = useContext(UserContext);
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [singleTrip, setSingleTrip] = useState(null);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (authToken) {
            fetchTrips();
        }
    }, [authToken]);

    const fetchTrips = useCallback(async () => {
        if (!authToken) {
            toast.error("Authentication token missing!");
            return;
        }

        fetch("https://journey-ease.onrender.com/trips", {
            method: "GET",
            headers: { "Authorization": `Bearer ${authToken}` },
        })
            .then(response => response.json())
            .then(response => {
                if (Array.isArray(response)) {
                    setTrips(response);
                }
            })
            .catch(error => {
                console.error("Fetch Trips Error:", error);
                toast.error("Failed to fetch trips.");
            });
    }, [authToken]);

    const fetchSingleTrip = useCallback(async (tripId) => {
        if (!tripId) {
            toast.error("Invalid trip reference!");
            return;
        }

        fetch(`https://journey-ease.onrender.com/trip/${tripId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(response => response.json())
            .then(response => {
                if (response.trip_ref) {
                    setSingleTrip(response);
                } else {
                    toast.error(response.error || "Error fetching trip!");
                }
            })
            .catch(error => {
                console.error("Error fetching trip:", error);
                toast.error("Failed to fetch trip.");
            });
    }, [authToken]);

    const fetchReservations = useCallback(async (tripId) => {
        if (!tripId) return;

        fetch(`https://journey-ease.onrender.com/reservations/${tripId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReservations(data);
                } else {
                    toast.error("Error fetching reservations!");
                }
            })
            .catch(error => {
                console.error("Error fetching reservations:", error);
                toast.error("Failed to fetch reservations.");
            });
    }, [authToken]);

    const addTrip = async (country, tripActivity, duration) => {
        fetch("https://journey-ease.onrender.com/trip/addtrip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ country, tripActivity, duration })
        })
            .then(response => response.json())
            .then(response => {
                response.success ? toast.success(response.success) : toast.error(response.error || "Error adding trip!");
                fetchTrips();
            });
    };

    const updateTrip = async (tripId, country, tripActivity, duration) => {
        fetch(`https://journey-ease.onrender.com/trip/update/${tripId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ country, tripActivity, duration })
        })
            .then(response => response.json())
            .then(response => {
                response.success ? toast.success(response.success) : toast.error(response.error || "Error updating trip!");
                fetchSingleTrip(tripId);
            });
    };

    const deleteTrip = async (tripId) => {
        fetch(`https://journey-ease.onrender.com/trip/delete/${tripId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(response => response.json())
            .then(response => {
                response.success ? toast.success(response.success) : toast.error(response.error || "Error deleting trip!");
                navigate("/trip");
            });
    };

    const data = {
        trips,
        reservations,
        singleTrip,
        fetchTrips,
        fetchSingleTrip,
        updateTrip,
        addTrip,
        deleteTrip,
        fetchReservations,
    };

    return (
        <TripContext.Provider value={{ data }}>
            {children}
        </TripContext.Provider>
    );
};
