import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";

import Navbar from "./components/UI/navbar/Navbar";
import { Spinner } from "./components/Spinner";
import { AdminGuard, PublicRoute } from "./components/core/ProtectedRoute";

import { Home } from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgetPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AddProblemPage } from "./pages/AddProblemPage";
import { UpdateProblemPage } from "./pages/UpdateProblemPage";

export const App = () => {
  const { initTheme } = useThemeStore();
  const { authUser, isCheckAuth, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  if (isCheckAuth && !authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen w-screen bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* Admin Authorized Zones */}
        <Route
          element={
            <AdminGuard isAuthenticated={isAuthenticated} user={authUser} />
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/add-problem" element={<AddProblemPage />} />
          <Route
            path="/admin/update-problem/:problemId"
            element={<UpdateProblemPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
