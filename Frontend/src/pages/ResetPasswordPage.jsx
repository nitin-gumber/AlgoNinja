import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router";
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

import { resetPasswordSchema } from "../validations/validation-schema";
import { useAuthStore } from "../store/useAuthStore";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { isProcessingAction, resetPassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ password }) => {
   
    const result = await resetPassword(token, password);
    if (result?.success) {
      navigate("/login");
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col justify-center items-center px-6 py-14 sm:px-10 relative overflow-hidden"
        style={{
          background: "#0a0a0a",
          fontFamily: "'Satoshi', sans-serif",
        }}
      >
        {/* ── Background Subtle Ambient Glow ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 400px at 50% 50%, oklch(0.6 0.25 25 / 8%) 0%, transparent 100%)`,
          }}
        />

        {/* ── Centralized Card Container ── */}
        <div className="w-full max-w-100 relative z-10 flex flex-col">
          {/* Back to Login escape link */}
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-[2rem] font-bold leading-tight tracking-tight text-white mb-2"
              style={{ fontFamily: "'ARP Display', sans-serif" }}
            >
              Reset Password
            </h1>
            <p className="text-sm text-white/45 leading-relaxed">
              Create a strong new password to regain access to your account.
            </p>
          </div>

          {/* ── Reset Password Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password Input */}
            <div className="flex flex-col gap-1.5 w-full relative">
              <label
                htmlFor="password"
                className="text-xs font-medium tracking-wide text-white/50"
              >
                New Password <span className="font-sm text-brand">*</span>
              </label>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full h-11 px-4 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-150 border focus:border-transparent ${
                  errors.password
                    ? "border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500"
                    : "border-white/10 bg-white/6 hover:bg-white/8 focus:bg-white/8 focus:ring-2 focus:ring-brand"
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 right-0 w-11 flex items-center justify-center
                         text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1.5 w-full relative">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium tracking-wide text-white/50"
              >
                Confirm Password <span className="font-sm text-brand">*</span>
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full h-11 px-4 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-150 border focus:border-transparent ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500"
                    : "border-white/10 bg-white/6 hover:bg-white/8 focus:bg-white/8 focus:ring-2 focus:ring-brand"
                }`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                  {errors.confirmPassword.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 right-0 w-11 flex items-center justify-center
                         text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isProcessingAction}
              className={`w-full h-11 rounded-xl text-sm font-semibold text-white
                         flex items-center justify-center gap-2 mt-2
                         transition-all duration-150 active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed ${
                           isProcessingAction ? "bg-[#555555]" : "bg-lightRed"
                         }`}
            >
              {isProcessingAction ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating
                  password…
                </>
              ) : (
                <>
                  Update Password <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Fallback support info text link footer */}
          <p className="text-center text-sm text-white/35 mt-8">
            Having trouble?{" "}
            <Link
              to="/support"
              className="font-semibold hover:underline underline-offset-2 transition-colors text-brand"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
