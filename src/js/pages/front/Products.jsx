import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CartContext } from "../../context/CartContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosClient from "../../context/axiosClient";
import { useTranslation } from "react-i18next";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import "../../../css/style.css";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { t, i18n } = useTranslation();

  const PRODUCTS_PER_PAGE = 24;
  const [displayedProductCount, setDisplayedProductCount] = useState(PRODUCTS_PER_PAGE);
  const hasMoreProducts = displayedProductCount < filteredProducts.length;

  useEffect(() => {
    document.title = t("products.metaTitle");
    fetchProducts();
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    let sortedProducts = [...products];
    if (sortOrder === "price-asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else {
      sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const normalizedSearch = searchTerm.toLowerCase();
    const selectedCategoryId = selectedCategory ? Number(selectedCategory) : null;

    const filtered = sortedProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        !selectedCategoryId ||
        product.category_id === selectedCategoryId ||
        product.category?.id === selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
    setDisplayedProductCount(PRODUCTS_PER_PAGE); // Reset count on search/sort change
  }, [searchTerm, sortOrder, products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/api/frontend/products");
      setProducts(res.data.products);
      setFilteredProducts(res.data.products);
      setDisplayedProductCount(PRODUCTS_PER_PAGE); // Initialize displayed count
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/api/categories");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCategories(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadMore = () => {
    setDisplayedProductCount((prevCount) => prevCount + PRODUCTS_PER_PAGE);
  };

  const handleAddToCart = async (product) => {
    await addToCart(product.id);
    alert(t("products.addedAlert", { name: product.name }));
  };

  const activeCategories = categories.filter(
    (category) => category.status === 1 || category.status === true
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="mt-5 flex-grow-1">
        <h2 className="mb-4 text-center">{t("products.heading")}</h2>
        <Row className="mb-4 g-3">
          <Col md={4}>
            <FormControl
              type="text"
              placeholder={t("products.searchPlaceholder")}
              className="mr-sm-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              aria-label={t("products.categoryLabel")}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">{t("products.allCategories")}</option>
              {activeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4} className="d-flex justify-content-md-end">
            <Form.Select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              style={{ width: "200px" }}
            >
              <option value="latest">{t("products.sortLatest")}</option>
              <option value="price-asc">{t("products.sortPriceAsc")}</option>
              <option value="price-desc">{t("products.sortPriceDesc")}</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          {filteredProducts.slice(0, displayedProductCount).map((product) => (
            <Col md={4} lg={3} className="mb-4" key={product.id}>
              <Card className="h-100 shadow-sm product-card">
                <Card.Img
                  variant="top"
                  src={`${apiBaseUrl}/uploads/products/${product.image}`}
                  alt={product.name}
                  className="product-img"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted">${product.price}</Card.Text>
                  <Button
                    variant="primary"
                    className="mt-auto"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    {t("products.addToCart")}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="my-4">
          <Col className="text-center">
            {hasMoreProducts && (
              <Button onClick={handleLoadMore} variant="info">
                {t("products.loadMore")}
              </Button>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Products;
