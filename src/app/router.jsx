import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/layout";

import Home from "../pages/public/home";
import Categories from "../pages/public/categories";
import Catalog from "../pages/public/catalog";
import ProductDetail from "../pages/public/productDetail";
import Login from "../pages/public/login";
import Register from "../pages/public/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "categorias", element: <Categories /> },
      { path: "c/:catSlug", element: <Catalog /> },
      { path: "c/:catSlug/:subSlug", element: <Catalog /> },
      { path: "producto/:id", element: <ProductDetail /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);
