import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = t("editProfile.metaTitle");
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
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

        try {
            const response = await axios.post('/profile', formData);
            setUser(response.data.user);
            setSuccess(t("editProfile.success"));
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container py-4">
                <h1>{t("editProfile.title")}</h1>
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("editProfile.name")}</label>
                        <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">{t("editProfile.email")}</label>
                        <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">{t("editProfile.phone")}</label>
                        <input type="text" id="phone" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? t("editProfile.submitting") : t("editProfile.submit")}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;
