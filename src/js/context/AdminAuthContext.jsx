import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Configuración base de Axios
axios.defaults.baseURL = "http://127.0.0.1:8000";
// Importante: Esto permite que Laravel acepte las cookies/tokens en peticiones CORS
axios.defaults.withCredentials = true; 

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    // Iniciamos loading en true para verificar sesión antes de mostrar la app
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        
        if (token) {
            // Si hay token, lo inyectamos y verificamos si sigue vivo
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchAdmin();
        } else {
            // Si no hay token, no hacemos petición (evita el error 401 inicial)
            setLoading(false);
        }
    }, []);

    const fetchAdmin = async () => {
        try {
            const { data } = await axios.get("/api/backend/user");
            setAdmin(data);
        } catch (error) {
            // Si el token venció (401), limpiamos todo localmente sin llamar a la API de logout
            // para evitar un segundo error 401 innecesario.
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("adminToken");
                delete axios.defaults.headers.common["Authorization"];
                setAdmin(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Asegúrate que tu ruta en Laravel sea realmente esta
            const { data } = await axios.post("/api/backend/login", { email, password });
            
            // Verificamos que el token venga en la respuesta
            if (data.token) {
                const token = data.token;
                localStorage.setItem("adminToken", token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setAdmin(data.user);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Admin login failed:", error);
            return false;
        }
    };

    const logout = async () => {
        // 1. Limpieza rápida en el Frontend (UX Inmediata)
        localStorage.removeItem("adminToken");
        delete axios.defaults.headers.common["Authorization"];
        setAdmin(null);

        // 2. Intentar invalidar token en el Backend
        try {
            await axios.post("/api/backend/logout");
        } catch (error) {
            // Ignoramos errores aquí, ya que el usuario ya salió visualmente
        }
    };

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);