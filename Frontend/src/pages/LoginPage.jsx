import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

import { FcGoogle } from "react-icons/fc";

import { NinjaIllustration } from "../components/core/NinjaIllustration";
import { loginFormSchema } from "../validations/validation-schema";
import { useAuthStore } from "../store/useAuthStore";

const R_HEX = "#e02020";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Assuming your auth store provides login status states and actions
  const { isLoggingIn, login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    const result = await login({ email, password });
    if (result?.success) {
      navigate("/");
    }
  };

  const handleOAuth = (provider) =>
    (window.location.href = `${import.meta.env.VITE_BASE_URL}/api/v1/auth/${provider}`);

  return (
    <>
      <div
        className="min-h-screen flex flex-col lg:flex-row"
        style={{
          background: "#0a0a0a",
          fontFamily: "'Satoshi', sans-serif",
        }}
      >
        {/* ════════════════════════════════════════════════════
            LEFT — Form column
        ════════════════════════════════════════════════════ */}
        <section
          className="flex-1 flex flex-col justify-center items-center
                     px-6 py-14 sm:px-10 lg:px-16 xl:px-20
                     relative"
        >
          <div className="w-full max-w-100 relative z-10">
            {/* Heading */}
            <div className="mb-8">
              <h1
                className="text-[2rem] font-bold leading-tight tracking-tight text-white mb-2"
                style={{ fontFamily: "'ARP Display', sans-serif" }}
              >
                Welcome Back Ninja
              </h1>
              <p className="text-sm text-white/45 leading-relaxed">
                Log in to continue sharpening your skills and conquering
                problems.
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="email"
                  className="text-xs font-medium tracking-wide text-white/50"
                >
                  Email <span className="font-sm text-brand">*</span>
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

              {/* Password Field */}
              <div className="flex flex-col gap-1.5 w-full relative">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium tracking-wide text-white/50"
                  >
                    Password <span className="font-sm text-brand">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-brand hover:underline underline-offset-2 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
                  className="absolute top-[30%] right-0 w-11 h-11 flex items-center justify-center
                           text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full h-11 rounded-xl text-sm font-semibold text-white
                           flex items-center justify-center gap-2 mt-4
                           transition-all duration-150 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed ${
                             isLoggingIn ? "bg-[#555555]" : "bg-lightRed"
                           }`}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying
                    Credentials…
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-borderofwhite" />
              <span className="text-xs text-white/30 shrink-0">or</span>
              <div className="flex-1 h-px bg-borderofwhite" />
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="w-full h-11 rounded-xl text-sm font-bold bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center gap-2.5 transition-all duration-150 shadow-md active:scale-[0.98] hover:border-red-50"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>

            {/* Signup Redirect Link */}
            <p className="text-center text-sm text-white/35 mt-7">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-semibold hover:underline underline-offset-2 transition-colors text-brand"
              >
                Register here
              </Link>
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            RIGHT — Illustration panel (lg+ only)
        ════════════════════════════════════════════════════ */}
        <aside
          className="hidden lg:flex flex-col items-center justify-center
                     w-120 xl:w-130 shrink-0 relative overflow-hidden px-10 py-16"
          style={{
            background:
              "linear-gradient(135deg, #111 0%, #0d0d0d 60%, #130808 100%)",
            borderLeft: `1px solid var(--borderofwhite)`,
          }}
          aria-hidden="true"
        >
          {/* Large ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${R_HEX}18 0%, transparent 70%)`,
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(var(--borderofwhite) 1px, transparent 1px),
                                linear-gradient(90deg, var(--borderofwhite) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content Wrapper */}
          <div className="relative z-10 w-full flex flex-col items-center gap-6">
            {/* Eyebrow badge */}
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
              style={{
                background: `${R_HEX}18`,
                border: `1px solid ${R_HEX}33`,
                color: R_HEX,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: R_HEX }}
              />
              AlgoNinja Platform
            </div>

            {/* Shared Vector Logo Illustration Component */}
            <NinjaIllustration />

            {/* Headline section */}
            <div className="text-center -mt-2">
              <h2
                className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight"
                style={{ fontFamily: "'ARP Display', sans-serif" }}
              >
                Master DSA. <span style={{ color: R_HEX }}>Get hired.</span>
              </h2>
              <p className="text-sm text-white/40 mt-2.5 max-w-xs mx-auto leading-relaxed">
                Solve real interview problems, get instant Judge0 feedback, and
                land your dream role at top companies.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
