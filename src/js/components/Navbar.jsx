import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext); // get user and logout function
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.qty, 0) || 0;

    const handleLogout = async () => {
        try {
            logout(); // update auth context
            navigate("/"); // redirect to home
            setIsOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNavLinkClick = () => setIsOpen(false);

    const handleToggleLanguage = () => {
        const next = i18n.language === "en" ? "es" : "en";
        i18n.changeLanguage(next);
        localStorage.setItem("lng", next);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">PoliMarket</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="navbarNav"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={handleNavLinkClick}>{t("nav.home")}</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products" onClick={handleNavLinkClick}>{t("nav.products")}</Link>
                        </li>
                        <li className="nav-item position-relative">
                            <Link className="nav-link" to="/cart" onClick={handleNavLinkClick}>
                                {t("nav.cart")}
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/messages" onClick={handleNavLinkClick}>Messages</Link>
                        </li>

                        {/* Show Login/Register if user not logged in */}
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" onClick={handleNavLinkClick}>{t("nav.login")}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register" onClick={handleNavLinkClick}>{t("nav.register")}</Link>
                                </li>
                            </>
                        )}

                        {/* Show Logout if user is logged in */}
                        {user && (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle bg-transparent border-0"
                                    id="userDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {user.name}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="fa fa-user me-2"></i> {t("nav.profile")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/order-history">
                                            <i className="fa fa-history me-2"></i> {t("nav.orders")}
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="fa fa-sign-out-alt me-2"></i> {t("nav.logout")}
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}
                        <li className="nav-item d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
                            <button className="btn btn-outline-secondary btn-sm" onClick={handleToggleLanguage}>
                                {i18n.language === "en" ? "ES" : "EN"}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
