import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../context/axiosClient'; // <--- CAMBIO IMPORTANTE: Usar axiosClient
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({}); // <--- Para mostrar errores de validación del backend

    useEffect(() => {
        document.title = t("editProfile.metaTitle");
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user, t, i18n.language]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setErrors({});

        try {
            // 1. Usamos PUT porque es una actualización
            // 2. Usamos /api/user que es la ruta que creamos en Laravel
            const response = await axiosClient.put('/api/user', formData);
            
            // 3. Actualizamos el usuario en el contexto global (Navbar, etc.)
            setUser(response.data.user);
            
            setSuccess(t("editProfile.success"));
            
            // Opcional: Redirigir al perfil después de 2 segundos
            setTimeout(() => {
                navigate('/profile');
            }, 2000);

        } catch (error) {
            console.error('Failed to update profile:', error);
            if (error.response && error.response.data.errors) {
                // Capturamos los errores del backend (ej: nombre muy corto)
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container py-4" style={{maxWidth: '600px'}}>
                <h1 className="mb-4">{t("editProfile.title")}</h1>
                
                {success && <div className="alert alert-success">{success}</div>}
                
                <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                    {/* NOMBRE */}
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("editProfile.name")}</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>

                    {/* EMAIL (Deshabilitado porque el backend no lo actualiza en esta ruta) */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">{t("editProfile.email")}</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            className="form-control bg-light" 
                            value={formData.email} 
                            disabled // <--- IMPORTANTE: Solo lectura
                            readOnly
                        />
                        <small className="text-muted">El correo electrónico no se puede editar.</small>
                    </div>

                    {/* TELÉFONO */}
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">{t("editProfile.phone")}</label>
                        <input 
                            type="text" 
                            id="phone" 
                            name="phone" 
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            value={formData.phone} 
                            onChange={handleChange} 
                            placeholder="+593..."
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone[0]}</div>}
                    </div>

                    <div className="d-flex justify-content-between">
                         <button type="button" className="btn btn-secondary" onClick={() => navigate('/profile')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? t("editProfile.submitting") : t("editProfile.submit")}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;