import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CartContext } from "../../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../../components/StripePaymentForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPaymentButtons from "../../components/PayPalPaymentButtons";
import axiosClient from "../../context/axiosClient"; // <- Axios instance with guest ID
import { useTranslation } from "react-i18next";

// Stripe setup
const stripePromise = loadStripe("pk_test_YOUR_STRIPE_PUBLIC_KEY");

// PayPal setup
const initialPayPalOptions = {
  clientId: "YOUR_PAYPAL_CLIENT_ID",
  currency: "USD",
  intent: "capture",
  components: "buttons",
};

const Checkout = () => {
  const { cart, fetchCart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", zip: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Fetch cart on mount
  useEffect(() => {
    document.title = t("checkout.metaTitle");
    fetchCart().finally(() => setLoading(false));
  }, [t, i18n.language]);

  // Handle order placement
  const handlePlaceOrder = async (e, stripePaymentMethodId = null, paypalOrderId = null) => {
    e?.preventDefault();
    try {
      // CSRF cookie for Laravel Sanctum
      await axiosClient.get("/sanctum/csrf-cookie");

      // Prepare order payload
      const orderData = {
        address,
        payment_method: paymentMethod,
      };

      if (paymentMethod === "stripe" && stripePaymentMethodId) {
        orderData.stripe_payment_method_id = stripePaymentMethodId;
      }

      if (paymentMethod === "paypal" && paypalOrderId) {
        orderData.paypal_order_id = paypalOrderId;
      }

      // Send order request
      const res = await axiosClient.post("/api/frontend/orders", orderData);

      clearCart();
      alert(t("checkout.orderSuccess", { id: res.data.order_id }));
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        // Validation errors
        const errorMessages = Object.values(err.response.data.errors).flat().join("\n");
        alert(`${t("checkout.validationError")}\n${errorMessages}`);
      } else {
        alert(err.response?.data?.error || err.response?.data?.message || t("checkout.errorGeneric"));
      }
    }
  };

  if (loading) return <p>{t("checkout.loading")}</p>;

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h2>{t("checkout.title")}</h2>

        {cart.items.length === 0 ? (
          <p>{t("checkout.empty")}</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>{t("checkout.product")}</th>
                  <th>{t("checkout.qty")}</th>
                  <th>{t("checkout.price")}</th>
                  <th>{t("checkout.subtotal")}</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.qty}</td>
                    <td>${item.product.price}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>{t("checkout.subtotal")}: ${cart.subtotal}</h4>

            <form onSubmit={paymentMethod === "cod" ? handlePlaceOrder : (e) => e.preventDefault()}>
              <h5>{t("checkout.shippingAddress")}</h5>
              <input
                type="text"
                placeholder={t("checkout.fullName")}
                className="form-control mb-2"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder={t("checkout.phone")}
                className="form-control mb-2"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder={t("checkout.street")}
                className="form-control mb-2"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder={t("checkout.city")}
                className="form-control mb-2"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder={t("checkout.zip")}
                className="form-control mb-3"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                required
              />

              <h5 className="mt-3">{t("checkout.paymentMethod")}</h5>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <label className="form-check-label">{t("checkout.cod")}</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                  />
                  <label className="form-check-label">{t("checkout.stripe")}</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <label className="form-check-label">{t("checkout.paypal")}</label>
                </div>
              </div>

              {paymentMethod === "stripe" && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm handlePlaceOrder={handlePlaceOrder} address={address} />
                </Elements>
              )}

              {paymentMethod === "paypal" && (
                <PayPalScriptProvider options={initialPayPalOptions}>
                  <PayPalPaymentButtons handlePlaceOrder={handlePlaceOrder} amount={cart.subtotal} />
                </PayPalScriptProvider>
              )}

              {paymentMethod === "cod" && (
                <button type="submit" className="btn btn-success mt-3">
                  {t("checkout.placeOrderCod")}
                </button>
              )}
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
