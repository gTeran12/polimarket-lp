import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../context/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = t("orderDetail.metaTitle");
        const fetchOrderDetail = async () => {
            if (!user) {
                setError(t("orderDetail.mustLogin"));
                setLoading(false);
                return;
            }
            try {
                const response = await axiosClient.get(`/api/frontend/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setError(t("orderDetail.unauthorized"));
                } else {
                    setError(t("orderDetail.fetchError"));
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId, user, t, i18n.language]);

    if (loading) return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">{t("orderDetail.loading")}</main>
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

    if (!order) return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">{t("orderDetail.notFound")}</main>
            <Footer />
        </div>
    );

    const { shipping_address: address } = order;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-5">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h2>{t("orderDetail.title")}</h2>
                        <Link to="/order-history" className="btn btn-secondary">{t("orderDetail.back")}</Link>
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h5>{t("orderDetail.order", { id: order.id })}</h5>
                                <p><strong>{t("orderDetail.date")}</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                <p><strong>{t("orderDetail.status")}</strong> <span className="text-capitalize">{order.status}</span></p>
                                <p><strong>{t("orderDetail.paymentMethod")}</strong> <span className="text-uppercase">{order.payment_method}</span></p>
                            </div>
                            <div className="col-md-6">
                                <h5>{t("orderDetail.shippingAddress")}</h5>
                                <address>
                                    <strong>{address.name}</strong><br />
                                    {address.street}<br />
                                    {address.city}, {address.zip}<br />
                                    <abbr title={t("orderDetail.phoneShort")}>{t("orderDetail.phoneShort")}</abbr> {address.phone}
                                </address>
                            </div>
                        </div>

                        <h5>{t("orderDetail.items")}</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>{t("orderDetail.product")}</th>
                                    <th>{t("orderDetail.quantity")}</th>
                                    <th>{t("orderDetail.price")}</th>
                                    <th>{t("orderDetail.subtotal")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.product ? item.product.name : t("orderDetail.missingProduct")}</td>
                                        <td>{item.qty}</td>
                                        <td>${parseFloat(item.price).toFixed(2)}</td>
                                        <td>${(item.qty * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="row text-end">
                            <div className="col-md-9"><strong>{t("orderDetail.totals.subtotal")}</strong></div>
                            <div className="col-md-3">${parseFloat(order.subtotal).toFixed(2)}</div>
                            <div className="col-md-9"><strong>{t("orderDetail.totals.shipping")}</strong></div>
                            <div className="col-md-3">${parseFloat(order.shipping).toFixed(2)}</div>
                            <div className="col-md-9"><strong>{t("orderDetail.totals.discount")}</strong></div>
                            <div className="col-md-3">-${parseFloat(order.discount).toFixed(2)}</div>
                            <div className="col-md-9"><h5>{t("orderDetail.totals.total")}</h5></div>
                            <div className="col-md-3"><h5>${parseFloat(order.total).toFixed(2)}</h5></div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderDetail;
