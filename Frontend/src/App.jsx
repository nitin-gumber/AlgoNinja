import React from "react";
import { Routes, Route } from "react-router";

import { Home } from "lucide-react";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgetPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

export const App = () => {
  const authUser = null;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
  );
};
