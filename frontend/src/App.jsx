import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminEnquiries from "./pages/AdminEnquiries.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingSocialMenu from "./components/FloatingSocialMenu.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/enquire/:productId" element={<ContactUs />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= ADMIN ROUTES (PROTECTED) ================= */}

        {/* /admin → /admin/dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/enquiries"
          element={
            <ProtectedRoute adminOnly>
              <AdminEnquiries />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={<div style={{ padding: "1rem" }}>Page not found</div>}
        />
      </Routes>

      {/* ================= GLOBAL TOAST ================= */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop
        pauseOnHover
        theme="light"
      />

      <Footer />
      <FloatingSocialMenu />
    </>
  );
};

export default App;
