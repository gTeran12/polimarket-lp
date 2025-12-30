import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ import AuthContext
import { useTranslation } from "react-i18next";

const Register = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // ✅ get user from context
    const { t, i18n } = useTranslation();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    // ✅ Redirect if already logged in
    useEffect(() => {
        document.title = t("register.metaTitle");
        if (user) {
            navigate("/"); // redirect to home if logged in
        }
    }, [user, navigate, t, i18n.language]);

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/api/users", form);

            setMessage(t("register.success"));
            setErrors({}); // Clear errors

            // Reset form fields
            setForm({
                name: "",
                email: "",
                password: "",
                password_confirmation: ""
            });

            // Redirect to login page after success
            setTimeout(() => navigate("/login"), 1000);

        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5" style={{ maxWidth: "500px" }}>
                <h2 className="mb-4">{t("register.title")}</h2>

                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">{t("register.name")}</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleInput}
                        />
                        {errors.name && <small className="text-danger">{errors.name[0]}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("register.email")}</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleInput}
                        />
                        {errors.email && <small className="text-danger">{errors.email[0]}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("register.password")}</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleInput}
                        />
                        {errors.password && <small className="text-danger">{errors.password[0]}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("register.confirmPassword")}</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleInput}
                        />
                    </div>

                    <button className="btn btn-primary w-100">{t("register.submit")}</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
