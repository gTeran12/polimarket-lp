import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext); // ✅ get user from context
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { t, i18n } = useTranslation();

    // ✅ Redirect if already logged in
    useEffect(() => {
        document.title = t("login.metaTitle");
        if (user) {
            navigate("/"); // redirect to home if logged in
        }
    }, [user, navigate, t, i18n.language]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(email, password); // call context login

        if (result.success) {
            alert(t("login.success"));
            navigate("/"); // redirect to home after login
        } else {
            setError(result.errors.message || t("login.invalid"));
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5" style={{ maxWidth: "450px" }}>
                <h3 className="mb-4">{t("login.title")}</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">{t("login.email")}</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("login.password")}</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary w-100">{t("login.submit")}</button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Login;
