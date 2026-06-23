import React from "react";
import { Routes, Route } from "react-router";

import { Home } from "lucide-react";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";

export const App = () => {
  const authUser = null;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};
