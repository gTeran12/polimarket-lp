import React, { useEffect, useContext, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { cart, fetchCart, updateCartItem, removeCartItem } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("cart.metaTitle");
    
    const fetch = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };

    fetch();
  }, [t, i18n.language]);

  const handleQtyChange = (itemId, qty) => {
    updateCartItem(itemId, qty);
  };

  const handleRemove = (itemId) => {
    removeCartItem(itemId);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("cart.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container my-4">
        <h2>{t("cart.title")}</h2>
        {cart.items.length === 0 ? (
          <p>{t("cart.empty")}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t("cart.product")}</th>
                <th>{t("cart.qty")}</th>
                <th>{t("cart.price")}</th>
                <th>{t("cart.subtotal")}</th>
                <th>{t("cart.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      min="1"
                      className="form-control"
                      style={{ width: "80px" }}
                      onChange={(e) =>
                        handleQtyChange(item.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>${item.product.price}</td>
                  <td>${item.price}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      {t("cart.remove")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h4>{t("cart.subtotalLabel")}: ${cart.subtotal}</h4>
        {cart.items.length > 0 && (
          <div className="d-flex justify-content-between gap-2 mt-4">
            <Link to="/products" className="btn btn-secondary btn-lg">
              {t("cart.continue")}
            </Link>
            <Link to="/checkout" className="btn btn-primary btn-lg">
              {t("cart.checkout")}
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
