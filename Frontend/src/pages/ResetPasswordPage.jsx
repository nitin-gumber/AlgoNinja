import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router";
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

import { resetPasswordSchema } from "../validations/validation-schema";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const { isDarkMode } = useThemeStore();
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
        className="min-h-screen flex flex-col justify-center items-center px-6 py-14 sm:px-10 relative overflow-hidden bg-background text-foreground transition-colors duration-200"
        style={{
          backgroundColor: isDarkMode ? "#0a0a0a" : "var(--color-background)",
          fontFamily: "'Satoshi', sans-serif",
        }}
      >
        {/* ── Background Subtle Ambient Glow (Responsive opacity tuning based on active mode) ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: isDarkMode
              ? `radial-gradient(circle 400px at 50% 50%, oklch(0.6 0.25 25 / 8%) 0%, transparent 100%)`
              : `radial-gradient(circle 400px at 50% 50%, oklch(0.6 0.25 25 / 4%) 0%, transparent 100%)`,
          }}
        />

        {/* ── Centralized Card Container ── */}
        <div className="w-full max-w-100 relative z-10 flex flex-col">
          {/* Back to Login escape link */}
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to sign in
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-foreground mb-2 arp-display">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
              Create a strong new password to regain access to your account.
            </p>
          </div>

          {/* ── Reset Password Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="password"
                className="text-xs font-medium tracking-wide text-muted-foreground"
              >
                New Password <span className="text-brand font-semibold">*</span>
              </label>

              {/* ✅ isolated sub-container prevents layout shifting when error messages load below */}
              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full h-11 pl-4 pr-12 rounded-xl text-sm bg-card text-foreground placeholder-foreground/20 outline-none transition-all duration-150 border focus:border-transparent ${
                    errors.password
                      ? "border-destructive bg-destructive/5 focus:ring-2 focus:ring-destructive"
                      : "border-border hover:bg-muted/10 focus:bg-muted/10 focus:ring-2 focus:ring-brand"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute top-1/2 -translate-y-1/2 right-0 w-11 h-11 flex items-center justify-center
                           text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1.5 mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium tracking-wide text-muted-foreground"
              >
                Confirm Password{" "}
                <span className="text-brand font-semibold">*</span>
              </label>

              {/* ✅ isolated sub-container prevents layout shifting when error messages load below */}
              <div className="relative w-full">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full h-11 px-4 rounded-xl text-sm bg-card text-foreground placeholder-foreground/20 outline-none transition-all duration-150 border focus:border-transparent ${
                    errors.confirmPassword
                      ? "border-destructive bg-destructive/5 focus:ring-2 focus:ring-destructive"
                      : "border-border hover:bg-muted/10 focus:bg-muted/10 focus:ring-2 focus:ring-brand"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute top-1/2 -translate-y-1/2 right-0 w-11 h-11 flex items-center justify-center
                           text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1.5 mt-0.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isProcessingAction}
              className={`w-full h-11 rounded-xl text-sm font-semibold text-white cursor-pointer
                         flex items-center justify-center gap-2 mt-2
                         transition-all duration-150 active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed ${
                           isProcessingAction
                             ? "bg-neutral-500"
                             : "bg-lightRed hover:opacity-90"
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
          <p className="text-center text-sm text-muted-foreground mt-8">
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
