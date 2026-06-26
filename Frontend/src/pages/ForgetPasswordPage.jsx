import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

import { forgotPasswordSchema } from "../validations/validation-schema";
import { useAuthStore } from "../store/useAuthStore";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const { isProcessingAction, forgotPassword } = useAuthStore();

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
    const result = await forgotPassword({ email });
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
          {/* Back to Login Link */}
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
              Recover Account
            </h1>
            <p className="text-sm text-white/45 leading-relaxed">
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
                className="text-xs font-medium tracking-wide text-white/50"
              >
                Email Address <span className="font-sm text-brand">*</span>
              </label>

              <input
                id="email"
                type="email"
                placeholder="xyz@gmail.com"
                autoComplete="email"
                className={`w-full h-11 px-4 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-150 border focus:border-transparent ${
                  errors.email
                    ? "border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500"
                    : "border-white/10 bg-white/6 hover:bg-white/8 focus:bg-white/8 focus:ring-2 focus:ring-brand"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Action Submit button */}
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
          <p className="text-center text-sm text-white/35 mt-8">
            Remembered credentials?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline underline-offset-2 transition-colors text-brand"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
