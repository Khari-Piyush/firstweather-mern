import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />

        {/* 404 page */}
        <Route path="*" element={<div style={{ padding: "1rem" }}>Page not found</div>} />
      </Routes>
    </div>
  );
};

export default App;
