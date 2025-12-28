import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = t("home.metaTitle");

        // Simulate API fetch or delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [t, i18n.language]);

    return (
        <>
            {loading ? (
                // Loading full page
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                // Full page content after loading
                <div>
                    <Navbar />

                    {/* Hero Section */}
                    <section className="bg-primary text-white text-center d-flex align-items-center" style={{ minHeight: "70vh" }}>
                        <div className="container">
                            <h1 className="display-3 fw-bold">{t("home.heroTitle")}</h1>
                            <p className="lead mt-3">{t("home.heroSubtitle")}</p>
                            <div className="mt-4">
                                <Link to="/products" className="btn btn-light btn-lg me-3">{t("home.shopNow")}</Link>
                                <Link to="/about" className="btn btn-outline-light btn-lg">{t("home.learnMore")}</Link>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-5">
                        <div className="container text-center">
                            <h2 className="mb-4">{t("home.whyChoose")}</h2>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card p-4 shadow-sm">
                                        <h4>{t("home.quality")}</h4>
                                        <p>{t("home.qualityDesc")}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card p-4 shadow-sm">
                                        <h4>{t("home.delivery")}</h4>
                                        <p>{t("home.deliveryDesc")}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card p-4 shadow-sm">
                                        <h4>{t("home.payments")}</h4>
                                        <p>{t("home.paymentsDesc")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-dark text-white py-5 text-center">
                        <div className="container">
                            <h2>{t("home.ctaTitle")}</h2>
                            <p className="lead mt-2">{t("home.ctaSubtitle")}</p>
                            <Link to="/register" className="btn btn-primary btn-lg mt-3">{t("home.getStarted")}</Link>
                        </div>
                    </section>

                    <Footer />
                </div>
            )}
        </>
    );
};

export default Home;
