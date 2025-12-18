import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext); // get user and logout function
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
                            <Link className="nav-link" to="/" onClick={handleNavLinkClick}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products" onClick={handleNavLinkClick}>Products</Link>
                        </li>
                        <li className="nav-item position-relative">
                            <Link className="nav-link" to="/cart" onClick={handleNavLinkClick}>
                                Cart
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </li>

                        {/* Show Login/Register if user not logged in */}
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" onClick={handleNavLinkClick}>Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register" onClick={handleNavLinkClick}>Register</Link>
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
                                            <i className="fa fa-user me-2"></i> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/order-history">
                                            <i className="fa fa-history me-2"></i> Order History
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="fa fa-sign-out-alt me-2"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
