import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axiosClient from '../../context/axiosClient'; // <--- Importante
import { useTranslation } from 'react-i18next';

const OrderDetail = () => {
    const { orderId } = useParams(); // Obtiene el ID de la URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        // Pedimos al backend el detalle de la orden ID
        axiosClient.get(`/api/frontend/orders/${orderId}`)
            .then(res => {
                setOrder(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('No se pudo cargar la orden. Puede que no exista o no tengas permisos.');
                setLoading(false);
            });
    }, [orderId]);

    if (loading) return <div className="container py-5">Cargando...</div>;
    if (error) return <div className="container py-5 text-danger">{error}</div>;
    if (!order) return null;

    return (
        <div>
            <Navbar />
            <div className="container py-5">
                <Link to="/order-history" className="btn btn-outline-secondary mb-3">
                    &larr; Volver al historial
                </Link>

                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Orden #{order.id}</h4>
                        <span className="badge bg-light text-dark">{order.order_status}</span>
                    </div>
                    <div className="card-body">
                        {/* Detalles Generales */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h5>Detalles de Envío</h5>
                                <p className="mb-1"><strong>Nombre:</strong> {order.address.name}</p>
                                <p className="mb-1"><strong>Dirección:</strong> {order.address.street}, {order.address.city}</p>
                                <p className="mb-1"><strong>Teléfono:</strong> {order.address.phone}</p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <h5>Resumen de Pago</h5>
                                <p className="mb-1"><strong>Método:</strong> {order.payment_method.toUpperCase()}</p>
                                <p className="mb-1"><strong>Estado Pago:</strong> {order.payment_status}</p>
                                <p className="mb-1"><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Tabla de Productos */}
                        <h5>Productos Comprados</h5>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio Unit.</th>
                                        <th>Cantidad</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {/* Verificamos si existe el producto, si fue borrado mostramos un texto */}
                                                {item.product ? item.product.name : 'Producto no disponible'}
                                            </td>
                                            <td>${Number(item.price).toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Total Pagado:</td>
                                        <td className="text-end fw-bold fs-5">${Number(order.total).toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderDetail;