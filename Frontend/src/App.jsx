import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { Home } from "./pages/Home";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgetPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/UI/navbar/Navbar";
import { Spinner } from "./components/Spinner";

export const App = () => {
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();

  const { authUser, isCheckAuth, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  if (isCheckAuth && !authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen  w-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? <Navigate to="/" /> : <ForgotPasswordPage />
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            isAuthenticated ? <Navigate to="/" /> : <ResetPasswordPage />
          }
        />
      </Routes>
    </>
  );
};
