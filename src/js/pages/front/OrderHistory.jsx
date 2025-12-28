import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../context/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = t("orders.metaTitle");
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                setError(t("orders.mustLogin"));
                return;
            }
            try {
                const response = await axiosClient.get('/api/frontend/orders');
                setOrders(response.data);
            } catch (err) {
                setError(t("orders.fetchError"));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, t, i18n.language]);

    if (loading) return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">{t("orders.loading")}</main>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">{error}</main>
            <Footer />
        </div>
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">
                <h1 className="mb-4">{t("orders.title")}</h1>
                {orders.length === 0 ? (
                    <p>{t("orders.empty")}</p>
                ) : (
                    <div className="list-group">
                        {orders.map(order => (
                            <Link key={order.id} to={`/order/${order.id}`} className="list-group-item list-group-item-action flex-column align-items-start">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">{t("orders.order", { id: order.id })}</h5>
                                    <small>{new Date(order.created_at).toLocaleDateString()}</small>
                                </div>
                                <p className="mb-1">{t("orders.total", { amount: parseFloat(order.total).toFixed(2) })}</p>
                                <small>{t("orders.status", { status: order.status })}</small>
                                <div className="mt-2">
                                    <button className="btn btn-sm btn-primary">{t("orders.viewDetails")}</button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrderHistory;
