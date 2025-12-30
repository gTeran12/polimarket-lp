import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = t("profile.metaTitle");
        if (!user) {
            axios.get("/api/user")
                .then(res => setUser(res.data))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [t, i18n.language]);

    if (loading) return <p>{t("profile.loading")}</p>;

    return (
        <div>
        <Navbar />
        <div className="container py-4">
            <h2>{t("profile.title")}</h2>
            <hr />

            <p><strong>{t("profile.name")}:</strong> {user.name}</p>
            <p><strong>{t("profile.email")}:</strong> {user.email}</p>
            <p><strong>{t("profile.phone")}:</strong> {user.phone ?? t("profile.notAvailable")}</p>

            <Link to="/profile/edit" className="btn btn-primary me-2">{t("profile.edit")}</Link>
            <Link to="/profile/update-password" className="btn btn-warning">{t("profile.changePassword")}</Link>
        </div>
        <Footer />
        </div>
    );
}
