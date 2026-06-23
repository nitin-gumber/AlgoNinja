import { toast } from "sonner";
import { axiosClient } from "../utils/axiosClient";
import { create } from "zustand";
import authRoutes from "../../../Backend/src/routes/auth.routes";

export const useAuthStore = create((set) => ({
  authUser: null,
  isAuthenticated: false,
  isSignUp: false,
  isLogginIn: false,
  isCheckAuth: false,
  isProcessingAction: false,

  checkAuth: async () => {
    set({ isCheckAuth: true });
    try {
      const response = await axiosClient.get("/auth/check");
      set({ authUser: response.data?.user, isAuthenticated: true });
      console.log("User fetch Data", response.data?.user);
      return { success: true };
    } catch (error) {
      console.error("Error When check user Auth", error);
      const errorMsg =
        error.response.data?.message ||
        "Invalid Token, Please try again later!";
      ste({ authUser: null, isAuthenticated: false });
      return { success: false };
    } finally {
      set({ isCheckAuth: false });
    }
  },

  signup: async (userData) => {
    set({ isSignUp: true });
    try {
      const response = await axiosClient.post("/auth/register", userData);
      toast.success(
        response.data?.message ||
          "User registered successfully. Please check your email to verify your account.",
      );
      console.log("Registration Server Data", response.data);
      return { success: true };
    } catch (error) {
      console.error("Error When User register", error);
      const errorMsg =
        error.response.data?.message || "Registration pipeline block";
      toast.error(errorMsg);
      return { success: false };
    } finally {
      set({ isSignUp: false });
    }
  },

  login: async (userData) => {
    set({ isLogginIn: true });
    try {
      const response = await axiosClient.post("/auth/login", userData);
      set({ authUser: response.data?.user, isAuthenticated: true });
      toast.success("Login successful!", {
        description: "Redirecting to your dashboard...",
      });
      return { success: true };
    } catch (error) {
      console.error("ERROR while logging in", error);
      const errorMsg =
        error.response?.data?.message || "Access Denied: Invalid tokens.";
      toast.error(errorMsg);
      return { success: false };
    } finally {
      set({ isLogginIn: false });
    }
  },

  logout: async () => {
    set({ isProcessingAction: true });
    try {
      const response = await axiosClient.get("auth/logout");
      set({ authUser: null, isAuthenticated: false });
      toast.success(response.data?.message);
      return { success: true }; // for navigate the user
    } catch (error) {
      console.error("Error logging out", error);
      const errorMsg =
        error.response?.data?.message || "Identity rejection: Invalid tokens.";
      toast.error(errorMsg);
      return { success: false };
    } finally {
      set({ isProcessingAction: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isProcessingAction: true });
    try {
      const response = await axiosClient.post("/auth/forgotPassword", email);
      toast.success(response.data?.message, {
        description: "Please check your email box",
      });
      return { success: true };
    } catch (error) {
      console.error("ERROR while forgetPassword in", error);
      const errorMsg =
        error.response?.data?.message || "Failed to forgetPassword";
      toast.error(errorMsg);
      return { success: false };
    } finally {
      set({ isProcessingAction: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isProcessingAction: true });
    try {
      const response = await axiosClient.post(
        `/auth/resetPassword/${token}`,
        newPassword,
      );
      toast.success(
        response.data?.message || "Password updated successfully!",
        {
          description: "Please Login Now with your new password!",
        },
      );
      return { success: true }; // for redirect the login page
    } catch (error) {
      console.error("Error When resetPassword", error);
      const errorMsg =
        error.response.data?.message || "Security token invalid or expired";
      toast.error(errorMsg);
      return { success: false };
    } finally {
      set({ isProcessingAction: false });
    }
  },
}));
