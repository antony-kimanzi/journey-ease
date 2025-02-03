import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [currentUser, setCurrentUser] = useState(null);
    const [onUserChange, setOnUserChange] = useState(false);
    const [trips, setTrips] = useState([]);
    const [singleTrip, setSingleTrip] = useState(null);
    const [reservations, setReservations] = useState([]);

    
    useEffect(() => {
        if (authToken && !onUserChange) {
            fetchCurrentUser();
        }
    }, [authToken]);

    useEffect(() => {
        if (authToken && onUserChange) {
            fetchCurrentUser();
            setOnUserChange(!onUserChange);
        }
    }, [authToken, onUserChange]);

    useEffect(() => {
        if (authToken) {
            console.log("Fetching trips with token:", authToken);
            fetchTrips();
        }
    }, [authToken]);

    const login = async (email, password) => {
        fetch("https://journey-ease.onrender.com/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(response => {
            console.log("Login API Response:", response);
            if (response.access_token) {
                sessionStorage.setItem("token", response.access_token);
                setAuthToken(response.access_token);
                navigate("/");
                toast.success("Welcome!");
                console
                
            } else {
                toast.error(response.error || "Failed to log in");
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            toast.error("An error occurred during login.");
        });
    };

    const addUser = async (username, email, password, phoneNumber) => {
        fetch("https://journey-ease.onrender.com/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, phoneNumber }),
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                navigate("/login")
                toast.success(response.success);
            } else {
                toast.error(response.error || "Failed to register");
            }
        })
        .catch(error => {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration.");
        });
    };

    const fetchCurrentUser = async () => {
        if (!authToken) return;
        
        fetch("https://journey-ease.onrender.com/user/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then(response => response.json())
        .then(response => {
            if (response.email) {
                setCurrentUser(response);
            } else {
                toast.error(response.error || "Failed to fetch profile");
            }
        })
        .catch(error => {
            console.error("Error fetching profile:", error);
            toast.error("An error occurred while fetching profile.");
        });
    };

    const updateUser = async (updatedData) => {
        if (!authToken) {
            toast.error("You must be logged in to update your profile.");
            return;
        }
        
        fetch("https://journey-ease.onrender.com/user/updateprofile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                toast.success("Profile updated successfully!");
                setOnUserChange(!onUserChange);
            } else {
                toast.error(response.error || "Failed to update profile.");
            }
        })
        .catch(error => {
            console.error("Update error:", error);
            toast.error("An error occurred while updating.");
        });
    };

    const deleteUser = () => {
        if (!authToken) {
            toast.error("You must be logged in to update your profile.");
            return;
        }
        
        fetch("https://journey-ease.onrender.com/user/deleteaccount", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                
                setOnUserChange(!onUserChange);
                navigate("/")
                toast.success("Account deleted successfully!");
            } else {
                toast.error(response.error || "Failed to delete account.");
            }
        })
        .catch(error => {
            console.error("Delete error:", error);
            toast.error("An error occurred while deleting.");
        });
    };
    
    const logout = async () => {
        if (!authToken) {
            toast.error("You are already logged out!");
            return;
        }
        
        fetch("https://journey-ease.onrender.com/logout", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                sessionStorage.removeItem("token");
                setAuthToken(null);
                setCurrentUser(null);
                navigate("/");
                toast.success("Successfully logged out!");
            } else {
                throw new Error(response.error || "Logout failed");
            }
        })
        .catch(error => {
            console.error("Logout error:", error);
            toast.error(error.message || "An error occurred during logout");
        });
    };

    const fetchTrips = useCallback(async () => {
        console.log("Authorization Token Before Fetch:", authToken); // Debugging
    
        if (!authToken) {
            toast.error("Authentication token missing!");
            return;
        }
    
        fetch("https://journey-ease.onrender.com/trips", {
            method: "GET",
            headers: { "Authorization": `Bearer ${authToken}` },
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
    }, [authToken]); // 🔹 Ensure token updates inside useCallback

    const fetchSingleTrip = useCallback(async (tripId) => {
        if (!tripId) {
            console.error("fetchSingleTrip: tripId is missing!");
            toast.error("Invalid trip reference!");
            return;
        }
    
        console.log("Fetching trip with tripId:", tripId);
    
        fetch(`https://journey-ease.onrender.com/trip/${tripId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` },
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
    }, [authToken]);

    const addTrip = async (country, tripActivity, duration) => {
        fetch("https://journey-ease.onrender.com/trip/addtrip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
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
                Authorization: `Bearer ${authToken}`
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
            headers: { Authorization: `Bearer ${authToken}` },
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
            headers: { Authorization: `Bearer ${authToken}` },
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
                    Authorization: `Bearer ${authToken}`,
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
                    Authorization: `Bearer ${authToken}`,
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
                headers: { Authorization: `Bearer ${authToken}` },
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
        authToken,
        currentUser,
        login,
        addUser,
        updateUser,
        deleteUser,
        logout,
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
    };
    
    return (
        <AuthContext.Provider value={{ data }}>
            {children}
        </AuthContext.Provider>
    );    
};
