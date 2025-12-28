// src/js/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: {
    nav: { home: "Home", products: "Products", cart: "Cart", login: "Login", register: "Register", profile: "Profile", orders: "Order History", logout: "Logout" },
    home: {
      metaTitle: "Home | PoliMarket",
      heroTitle: "Welcome to Our Store",
      heroSubtitle: "Discover amazing products and shop with ease.",
      shopNow: "Shop Now",
      learnMore: "Learn More",
      whyChoose: "Why Choose Us?",
      quality: "Quality Products",
      qualityDesc: "We ensure top quality items for your daily needs.",
      delivery: "Fast Delivery",
      deliveryDesc: "Get your orders delivered quickly and safely.",
      payments: "Secure Payments",
      paymentsDesc: "Shop confidently with our secure payment system.",
      ctaTitle: "Join Thousands of Happy Customers",
      ctaSubtitle: "Start shopping today and experience the difference.",
      getStarted: "Get Started"
    },
    products: {
      metaTitle: "Products | PoliMarket",
      heading: "Our Products",
      searchPlaceholder: "Search products...",
      sortLatest: "Latest",
      sortPriceAsc: "Price: Low to High",
      sortPriceDesc: "Price: High to Low",
      addToCart: "Add to Cart",
      loadMore: "Load More Products",
      addedAlert: "{{name}} added to cart"
    },
    cart: {
      metaTitle: "Cart | PoliMarket",
      loading: "Loading cart...",
      title: "Your Cart",
      empty: "Your cart is empty.",
      product: "Product",
      qty: "Qty",
      price: "Price",
      subtotal: "Subtotal",
      actions: "Actions",
      remove: "Remove",
      continue: "Continue Shopping",
      checkout: "Checkout",
      subtotalLabel: "Subtotal"
    },
    checkout: {
      metaTitle: "Checkout | PoliMarket",
      loading: "Loading checkout...",
      title: "Checkout",
      empty: "Your cart is empty.",
      product: "Product",
      qty: "Qty",
      price: "Price",
      subtotal: "Subtotal",
      shippingAddress: "Shipping Address",
      fullName: "Full Name",
      phone: "Phone",
      street: "Street",
      city: "City",
      zip: "ZIP",
      paymentMethod: "Payment Method",
      cod: "Cash on Delivery (COD)",
      stripe: "Credit/Debit Card (Stripe)",
      paypal: "PayPal",
      placeOrderCod: "Place Order (COD)",
      validationError: "Validation Error:",
      orderSuccess: "Order placed successfully! Order ID: {{id}}",
      errorGeneric: "Error placing order"
    },
    login: {
      metaTitle: "Login | PoliMarket",
      title: "Login",
      email: "Email",
      password: "Password",
      submit: "Login",
      success: "Login successful!",
      invalid: "Invalid credentials"
    },
    register: {
      metaTitle: "Register | PoliMarket",
      title: "Register",
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      submit: "Register",
      success: "Registration successful!"
    },
    profile: {
      metaTitle: "Profile | PoliMarket",
      loading: "Loading...",
      title: "My Profile",
      name: "Name",
      email: "Email",
      phone: "Phone",
      notAvailable: "N/A",
      edit: "Edit Profile",
      changePassword: "Change Password"
    },
    orders: {
      metaTitle: "Order History | PoliMarket",
      loading: "Loading...",
      mustLogin: "You must be logged in to view your order history.",
      fetchError: "Failed to fetch orders.",
      title: "Order History",
      empty: "You have no orders.",
      order: "Order #{{id}}",
      total: "Total: ${{amount}}",
      status: "Status: {{status}}",
      viewDetails: "View Details"
    },
    orderDetail: {
      metaTitle: "Order Detail | PoliMarket",
      loading: "Loading...",
      mustLogin: "You must be logged in to view order details.",
      unauthorized: "You are not authorized to view this order.",
      fetchError: "Failed to fetch order details.",
      notFound: "Order not found.",
      title: "Order Detail",
      back: "Back to Orders",
      order: "Order #{{id}}",
      date: "Date:",
      status: "Status:",
      paymentMethod: "Payment Method:",
      shippingAddress: "Shipping Address",
      phoneShort: "P:",
      items: "Order Items",
      product: "Product",
      quantity: "Quantity",
      price: "Price",
      subtotal: "Subtotal",
      missingProduct: "Product not found",
      totals: {
        subtotal: "Subtotal:",
        shipping: "Shipping:",
        discount: "Discount:",
        total: "Total:"
      }
    },
    editProfile: {
      metaTitle: "Edit Profile | PoliMarket",
      title: "Edit Profile",
      name: "Name",
      email: "Email",
      phone: "Phone",
      submit: "Update Profile",
      submitting: "Updating...",
      success: "Profile updated successfully!"
    },
    updatePassword: {
      metaTitle: "Update Password | PoliMarket",
      title: "Update Password",
      current: "Current Password",
      new: "New Password",
      confirm: "Confirm New Password",
      submit: "Update Password",
      submitting: "Updating...",
      success: "Password updated successfully!",
      error: "An error occurred."
    },
    footer: {
      rights: "All Rights Reserved."
    }
  }},
  es: { translation: {
    nav: { home: "Inicio", products: "Productos", cart: "Carrito", login: "Ingresar", register: "Registrarse", profile: "Perfil", orders: "Historial", logout: "Salir" },
    home: {
      metaTitle: "Inicio | PoliMarket",
      heroTitle: "Bienvenido a Nuestra Tienda",
      heroSubtitle: "Descubre productos increíbles y compra con facilidad.",
      shopNow: "Comprar ahora",
      learnMore: "Saber más",
      whyChoose: "¿Por qué elegirnos?",
      quality: "Productos de calidad",
      qualityDesc: "Garantizamos artículos de primera para tu día a día.",
      delivery: "Entrega rápida",
      deliveryDesc: "Recibe tus pedidos rápido y seguro.",
      payments: "Pagos seguros",
      paymentsDesc: "Compra con confianza con nuestro sistema de pagos.",
      ctaTitle: "Únete a miles de clientes felices",
      ctaSubtitle: "Empieza a comprar hoy y vive la diferencia.",
      getStarted: "Comenzar"
    },
    products: {
      metaTitle: "Productos | PoliMarket",
      heading: "Nuestros Productos",
      searchPlaceholder: "Buscar productos...",
      sortLatest: "Más recientes",
      sortPriceAsc: "Precio: menor a mayor",
      sortPriceDesc: "Precio: mayor a menor",
      addToCart: "Agregar al carrito",
      loadMore: "Cargar más productos",
      addedAlert: "{{name}} agregado al carrito"
    },
    cart: {
      metaTitle: "Carrito | PoliMarket",
      loading: "Cargando carrito...",
      title: "Tu carrito",
      empty: "Tu carrito está vacío.",
      product: "Producto",
      qty: "Cant.",
      price: "Precio",
      subtotal: "Subtotal",
      actions: "Acciones",
      remove: "Eliminar",
      continue: "Seguir comprando",
      checkout: "Pagar",
      subtotalLabel: "Subtotal"
    },
    checkout: {
      metaTitle: "Pagar | PoliMarket",
      loading: "Cargando checkout...",
      title: "Pagar",
      empty: "Tu carrito está vacío.",
      product: "Producto",
      qty: "Cant.",
      price: "Precio",
      subtotal: "Subtotal",
      shippingAddress: "Dirección de envío",
      fullName: "Nombre completo",
      phone: "Teléfono",
      street: "Calle",
      city: "Ciudad",
      zip: "CP",
      paymentMethod: "Método de pago",
      cod: "Pago contra entrega (COD)",
      stripe: "Tarjeta de crédito/débito (Stripe)",
      paypal: "PayPal",
      placeOrderCod: "Realizar pedido (COD)",
      validationError: "Error de validación:",
      orderSuccess: "¡Pedido realizado con éxito! ID: {{id}}",
      errorGeneric: "Error al realizar el pedido"
    },
    login: {
      metaTitle: "Ingresar | PoliMarket",
      title: "Ingresar",
      email: "Correo",
      password: "Contraseña",
      submit: "Ingresar",
      success: "¡Ingreso exitoso!",
      invalid: "Credenciales inválidas"
    },
    register: {
      metaTitle: "Registro | PoliMarket",
      title: "Registrarse",
      name: "Nombre",
      email: "Correo",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      submit: "Registrarse",
      success: "¡Registro exitoso!"
    },
    profile: {
      metaTitle: "Perfil | PoliMarket",
      loading: "Cargando...",
      title: "Mi perfil",
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      notAvailable: "N/D",
      edit: "Editar perfil",
      changePassword: "Cambiar contraseña"
    },
    orders: {
      metaTitle: "Historial de pedidos | PoliMarket",
      loading: "Cargando...",
      mustLogin: "Debes iniciar sesión para ver tu historial de pedidos.",
      fetchError: "No se pudieron obtener los pedidos.",
      title: "Historial de pedidos",
      empty: "No tienes pedidos.",
      order: "Pedido #{{id}}",
      total: "Total: ${{amount}}",
      status: "Estado: {{status}}",
      viewDetails: "Ver detalles"
    },
    orderDetail: {
      metaTitle: "Detalle de pedido | PoliMarket",
      loading: "Cargando...",
      mustLogin: "Debes iniciar sesión para ver los detalles del pedido.",
      unauthorized: "No estás autorizado para ver este pedido.",
      fetchError: "No se pudieron obtener los detalles del pedido.",
      notFound: "Pedido no encontrado.",
      title: "Detalle de pedido",
      back: "Volver a pedidos",
      order: "Pedido #{{id}}",
      date: "Fecha:",
      status: "Estado:",
      paymentMethod: "Método de pago:",
      shippingAddress: "Dirección de envío",
      phoneShort: "T:",
      items: "Artículos del pedido",
      product: "Producto",
      quantity: "Cantidad",
      price: "Precio",
      subtotal: "Subtotal",
      missingProduct: "Producto no encontrado",
      totals: {
        subtotal: "Subtotal:",
        shipping: "Envío:",
        discount: "Descuento:",
        total: "Total:"
      }
    },
    editProfile: {
      metaTitle: "Editar perfil | PoliMarket",
      title: "Editar perfil",
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      submit: "Actualizar perfil",
      submitting: "Actualizando...",
      success: "¡Perfil actualizado con éxito!"
    },
    updatePassword: {
      metaTitle: "Actualizar contraseña | PoliMarket",
      title: "Actualizar contraseña",
      current: "Contraseña actual",
      new: "Nueva contraseña",
      confirm: "Confirmar nueva contraseña",
      submit: "Actualizar contraseña",
      submitting: "Actualizando...",
      success: "¡Contraseña actualizada con éxito!",
      error: "Ocurrió un error."
    },
    footer: {
      rights: "Todos los derechos reservados."
    }
  }},
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lng") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export const setLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("lng", lng);
};

export default i18n;
