import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const TripContext = createContext();

// eslint-disable-next-line react/prop-types
export const TripProvider = ({ children }) => {
    const { authToken } = useContext(UserContext);
    const navigate = useNavigate();


    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [trips, setTrips] = useState([]);
    const [singleTrip, setSingleTrip] = useState(null);
    const [reservations, setReservations] = useState([]);
        ;
    console.log("Auth Token from UserContext in TripContext:", authToken); // Debugging

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            console.log("Token retrieved from sessionStorage:", storedToken);
            setToken(storedToken);
        } else {
            console.warn("No token found in sessionStorage");
        }
    }, [authToken]);

    useEffect(() => {
        if (token) {
            fetchTrips();
        }
    }, [token]);
    

    const fetchTrips = useCallback(async () => {
        console.log("Auth Token Before Fetch:", token); // Debugging
    
        if (!token) {
            toast.error("Authentication token missing!");
            return;
        }
    
        fetch("https://journey-ease.onrender.com/trips", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((response) => {
                console.log("Fetched Trips:", response); // Debugging
                if (Array.isArray(response)) {
                    setTrips(response);
                }
            })
            .catch((error) => {
                console.error("Fetch Trips Error:", error);
                toast.error("Failed to fetch trips.");
            });
    }, []);
    
    const fetchSingleTrip = useCallback(async (tripId) => {
        if (!tripId) {
            console.error("fetchSingleTrip: tripId is missing!");
            toast.error("Invalid trip reference!");
            return;
        }
    
        console.log("Fetching trip with tripId:", tripId);
    
        fetch(`https://journey-ease.onrender.com/trip/${tripId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => {
                if (response.trip_ref) {
                    setSingleTrip(response);
                } else {
                    toast.error(response.error || "Error fetching trip!");
                }
            })
            .catch((error) => {
                console.error("Error fetching trip:", error);
                toast.error("Failed to fetch trip.");
            });
    }, []);


    const addTrip = async (country, tripActivity, duration) => {
        fetch("https://journey-ease.onrender.com/trip/addtrip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                country, tripActivity, duration
            })
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    toast.dismiss()
                    toast.success(response.success)
                    fetchTrips()
                }
                else if (response.error) {
                    toast.dismiss()
                    toast.error(response.error)
                }
                else {
                    toast.dismiss()
                    toast.error("Error adding trip!")
                }
            })
    }

    const updateTrip = async (tripId, country, tripActivity, duration) => {
        fetch(`https://journey-ease.onrender.com/trip/update/${tripId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                country, tripActivity, duration
            })
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    toast.dismiss()
                    fetchSingleTrip(tripId);
                    toast.success(response.success)
                                    }
                else if (response.error) {
                    toast.dismiss()
                    toast.error(response.error)
                }
                else {
                    toast.dismiss()
                    toast.error("Error updating trip!")
                }
            })
    }

    const deleteTrip = async (tripId) => {
        fetch(`https://journey-ease.onrender.com/trip/delete/${tripId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    toast.dismiss()
                    navigate("/trip")
                    toast.success(response.success)
                }
                else if (response.error) {
                    toast.dismiss()
                    toast.error(response.error)
                }
                else {
                    toast.dismiss()
                    toast.error("Error deleting trip!")
                }
            })
    };

    const fetchReservations = useCallback(async (tripId) => {
        if (!tripId) {
            console.error("fetchReservations: No tripId provided!");
            return;
        }
    
        console.log("Fetching reservations for tripId:", tripId);
        
    
        fetch(`https://journey-ease.onrender.com/reservations/${tripId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched Reservations:", data);
    
                if (Array.isArray(data)) {
                    setReservations(data);
                    console.log("reservation_date:", reservations.reservation_date)
                } else {
                    toast.error("Error fetching reservations!");
                }
            })
            .catch((error) => {
                console.error("Error fetching reservations:", error);
                toast.error("Failed to fetch reservations.");
            });
    }, []);
        
    
    const addReservation = async (tripId, reservation) => {
        fetch(`https://journey-ease.onrender.com/reservation/add/${tripId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reservation),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    toast.dismiss()
                    toast.success(response.success)
                    fetchReservations(tripId);                }
                else if (response.error) {
                    toast.dismiss()
                    toast.error(response.error)
                }
                else {
                    toast.dismiss()
                    toast.error("Error adding reservation");
                }
            })
    };

    const updateReservation = async (tripId, reservationId, updatedData) => {
        fetch(`https://journey-ease.onrender.com/reservation/update/${tripId}/${reservationId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    toast.dismiss()
                    toast.success(response.success)
                    fetchReservations(tripId);                }
                else if (response.error) {
                    toast.dismiss()
                    toast.error(response.error)
                }
                else {
                    toast.dismiss()
                    toast.error("Error updating reservation");
                }
            })
    };

    const deleteReservation = async (tripId, reservationId) => {
        fetch(`https://journey-ease.onrender.com/reservation/delete/${tripId}/${reservationId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    toast.dismiss()
                    fetchReservations(tripId);
                    toast.success(response.success)
                }
                else if (response.error) {
                    toast.dismiss()
                    toast.error(response.error)
                }
                else {
                    toast.dismiss()
                    toast.error("Error deleting reservation");
                }
            })
    };

    const navigateToReservations = (tripId) => {
        navigate(`/reservations/${tripId}`);
    };
    const navigateToSingleReservation = (tripId, reservationId) => {
        navigate(`/reservation/${tripId}/${reservationId}`);
    };
    const navigateToTrip = (tripId) => {
        navigate(`/trip/${tripId}`);
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
        addReservation,
        updateReservation,
        deleteReservation,
        navigateToReservations,
        navigateToSingleReservation,
        navigateToTrip
    }


    return (
        <TripContext.Provider
            value={{data}}
        >
            {children}
        </TripContext.Provider>
    );
};
