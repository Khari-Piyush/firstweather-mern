import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar.scrollaware.improved.jsx";
import Footer from "./components/Footer.improved.jsx";
import FloatingSocialMenu from "./components/FloatingSocialMenu.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ScrollToTop from "./components/ScrollTop.jsx"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageSkeleton from "./components/PageSkeleton.improved.jsx";

const HomePage = lazy(() => import("./pages/HomePage.improved.jsx"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage.improved.jsx"));
const CategoryDetailPage = lazy(() => import("./pages/CategoryDetailPage.improved.jsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.improved.jsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage.improved.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.improved.jsx"));
const AboutPage  = lazy(() => import("./pages/AboutPage.improved.jsx"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/AdminProducts.jsx"));
const AdminOrders = lazy(() => import("./pages/AdminOrders.jsx"));
const AdminEnquiries = lazy(() => import("./pages/AdminEnquiries.jsx"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials.improved.jsx"));



const App = () => {
  return (
    <>
      <Navbar />
      <div style={{ height: "var(--fw-nav-sa-h-expanded)" }} aria-hidden="true" />

      <Suspense fallback={<PageSkeleton />}>
       <ScrollToTop />
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoryDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
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

          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute adminOnly>
                <AdminTestimonials />
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
