import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StorePage from "../pages/StorePage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";

// Protected Admin Route wrapper
function ProtectedAdminRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const token = localStorage.getItem("token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function MainRouter() {
  return (
    <Routes>
      {/* Customer Storefront */}
      <Route path="/" element={<StorePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* Admin Portal */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

