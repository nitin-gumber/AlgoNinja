import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

import { forgotPasswordSchema } from "../validations/validation-schema";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

export const ForgotPasswordPage = () => {
  const { isProcessingAction, sendPasswordResetEmail } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }) => {
    await sendPasswordResetEmail(email);
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
        {/* ── Background Subtle Ambient Glow (Adapts dynamically to Light/Dark Mode) ── */}
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
          {/* Back to Login Link */}
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
              Recover Account
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
              Enter your registered email address below. We'll dispatch a secure
              password reset link to your inbox.
            </p>
          </div>

          {/* ── Recovery Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="email"
                className="text-xs font-medium tracking-wide text-muted-foreground"
              >
                Email Address{" "}
                <span className="text-brand font-semibold">*</span>
              </label>

              <input
                id="email"
                type="email"
                placeholder="xyz@gmail.com"
                autoComplete="email"
                className={`w-full h-11 px-4 rounded-xl text-sm bg-card text-foreground placeholder-foreground/20 outline-none transition-all duration-150 border focus:border-transparent ${
                  errors.email
                    ? "border-destructive bg-destructive/5 focus:ring-2 focus:ring-destructive"
                    : "border-border hover:bg-muted/10 focus:bg-muted/10 focus:ring-2 focus:ring-brand"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1.5 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Action Submit button */}
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Transmitting
                  link…
                </>
              ) : (
                <>
                  Send Recovery Link <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer fallback link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Remembered credentials?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline transition-colors text-brand"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
