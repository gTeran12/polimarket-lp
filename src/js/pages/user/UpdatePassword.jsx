import React, { useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axiosClient from '../../context/axiosClient'; // <--- USAR ESTE SIEMPRE
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({}); // Para errores específicos de campos
    const [generalError, setGeneralError] = useState(''); // Para errores generales
    
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = t("updatePassword.metaTitle");
    }, [t, i18n.language]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiamos errores al escribir
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError('');
        setSuccess('');

        try {
            // Usamos PUT y la ruta correcta de la API
            const response = await axiosClient.put('/api/user/password', formData);
            
            setSuccess(response.data.message || t("updatePassword.success"));
            
            // Limpiar el formulario por seguridad
            setFormData({ current_password: '', password: '', password_confirmation: '' });

            // Opcional: Redirigir al perfil después de 2 segundos
            setTimeout(() => navigate('/profile'), 2000);

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.errors) {
                // Errores de validación (ej: contraseña actual incorrecta, o nueva muy corta)
                setErrors(err.response.data.errors);
            } else if (err.response && err.response.data.message) {
                // Error general
                setGeneralError(err.response.data.message);
            } else {
                setGeneralError(t("updatePassword.error"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container py-4" style={{ maxWidth: "600px" }}>
                <h1>{t("updatePassword.title")}</h1>
                
                {success && <div className="alert alert-success">{success}</div>}
                {generalError && <div className="alert alert-danger">{generalError}</div>}
                
                <form onSubmit={handleSubmit} className="card p-4 shadow-sm mt-3">
                    
                    {/* CONTRASEÑA ACTUAL */}
                    <div className="mb-3">
                        <label htmlFor="current_password" className="form-label">{t("updatePassword.current")}</label>
                        <input 
                            type="password" 
                            id="current_password" 
                            name="current_password" 
                            className={`form-control ${errors.current_password ? 'is-invalid' : ''}`} 
                            value={formData.current_password} 
                            onChange={handleChange} 
                        />
                        {errors.current_password && <div className="invalid-feedback">{errors.current_password[0]}</div>}
                    </div>

                    <hr />

                    {/* NUEVA CONTRASEÑA */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">{t("updatePassword.new")}</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>

                    {/* CONFIRMAR CONTRASEÑA */}
                    <div className="mb-3">
                        <label htmlFor="password_confirmation" className="form-label">{t("updatePassword.confirm")}</label>
                        <input 
                            type="password" 
                            id="password_confirmation" 
                            name="password_confirmation" 
                            className="form-control" 
                            value={formData.password_confirmation} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/profile')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-warning" disabled={loading}>
                            {loading ? t("updatePassword.submitting") : t("updatePassword.submit")}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default UpdatePassword;