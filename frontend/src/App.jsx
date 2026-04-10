import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingSocialMenu from "./components/FloatingSocialMenu.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ScrollToTop from "./components/ScrollTop.jsx"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.jsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.jsx"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/AdminProducts.jsx"));
const AdminOrders = lazy(() => import("./pages/AdminOrders.jsx"));
const AdminEnquiries = lazy(() => import("./pages/AdminEnquiries.jsx"));



const App = () => {
  return (
    <>
      <Navbar />

      <Suspense fallback={<div style={{ padding: "2rem" }}>Loading...</div>}>
       <ScrollToTop />
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/enquire/:productId" element={<ContactUs />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ADMIN */}
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

          {/* 404 */}
          <Route
            path="*"
            element={<div style={{ padding: "1rem" }}>Page not found</div>}
          />
        </Routes>
      </Suspense>

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
