import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user");
            setUser(data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logout(); // Token is invalid, perform a full silent logout
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const guestId = localStorage.getItem('guest_id');
            const headers = {};
            if (guestId) {
                headers['X-Guest-ID'] = guestId;
            }

            const { data } = await axios.post("/api/login", { email, password }, { headers });
            
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data.user); // Set user directly from login response
            
            if (guestId) {
                localStorage.removeItem('guest_id');
                delete axios.defaults.headers.common['X-Guest-ID'];
            }

            return { success: true };
        } catch (err) {
            console.error("User login failed:", err.response?.data || err);
            return { success: false, errors: err.response?.data || err.message };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            await axios.post("/api/users", { name, email, password, password_confirmation });
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err);
            return { success: false, errors: err.response?.data || err.message };
        }
    };

    const logout = async () => {
        // Optimistic logout
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);

        try {
            await axios.post("/api/logout");
        } catch (error) {
            // Silently ignore server-side logout errors
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
