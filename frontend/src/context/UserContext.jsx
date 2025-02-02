import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState('')
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [currentUser, setCurrentUser] = useState(null);
    const [onUserChange, setOnUserChange] = useState(false);
    
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
                setToken(response.access_token);
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
    
    
    const data = {
        token,
        authToken,
        currentUser,
        login,
        addUser,
        updateUser,
        deleteUser,
        logout
    };
    
    return (
        <UserContext.Provider value={{ data }}>
            {children}
        </UserContext.Provider>
    );    
};
