import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { NinjaIllustration } from "../components/core/NinjaIllustration";
import { loginFormSchema } from "../validations/validation-schema";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const R_HEX = "#e02020";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { isDarkMode } = useThemeStore();
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
        className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground transition-colors duration-200 relative pt-10"
        style={{
          backgroundColor: isDarkMode ? "#0a0a0a" : "var(--color-background)",
          fontFamily: "'Satoshi', sans-serif",
        }}
      >
        {/* ── Background Subtle Ambient Glow (Mirrors ResetPassword/SignUp execution across both modes) ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: isDarkMode
              ? `radial-gradient(circle 500px at 50% 50%, oklch(0.6 0.25 25 / 8%) 0%, transparent 100%)`
              : `radial-gradient(circle 500px at 50% 50%, oklch(0.6 0.25 25 / 4%) 0%, transparent 100%)`,
          }}
        />

        {/* ════════════════════════════════════════════════════
            LEFT — Form column
        ════════════════════════════════════════════════════ */}
        <section
          className="flex-1 flex flex-col justify-center items-center
                     px-6 py-14 sm:px-10 lg:px-16 xl:px-20
                     relative z-10"
        >
          <div className="w-full max-w-100 relative z-10">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-foreground mb-2 arp-display">
                Welcome Back Ninja
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
                  className="text-xs font-medium tracking-wide text-muted-foreground"
                >
                  Email <span className="text-brand font-semibold">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="xyz@gmail.com"
                  autoComplete="email"
                  className={`w-full h-11 px-4 rounded-xl text-sm text-foreground placeholder-foreground/20 outline-none transition-all duration-150 border focus:border-transparent ${
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

              {/* Password Field */}
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium tracking-wide text-muted-foreground"
                  >
                    Password <span className="text-brand font-semibold">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-brand hover:underline underline-offset-2 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* ✅ Isolated input container prevents layout shifting when error messages load below */}
                <div className="relative w-full">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full h-11 px-4 rounded-xl text-sm text-foreground placeholder-foreground/20 outline-none transition-all duration-150 border focus:border-transparent ${
                      errors.email
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full h-11 rounded-xl text-sm font-semibold text-white cursor-pointer
                           flex items-center justify-center gap-2 mt-4
                           transition-all duration-150 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed ${
                             isLoggingIn
                               ? "bg-neutral-500"
                               : "bg-lightRed hover:opacity-90"
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
              <div className="flex-1 h-px bg-borderofwhite opacity-10" />
              <span className="text-xs text-muted-foreground/40 shrink-0">
                or
              </span>
              <div className="flex-1 h-px bg-borderofwhite opacity-10" />
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="w-full h-11 rounded-xl text-sm font-bold bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center gap-2.5 transition-all duration-150 shadow-md active:scale-[0.98] cursor-pointer"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>

            {/* Signup Redirect Link */}
            <p className="text-center text-sm text-muted-foreground mt-7">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-semibold hover:underline transition-colors text-brand"
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
                     w-120 xl:w-130 shrink-0 relative overflow-hidden px-10 py-16 border-l border-border/10"
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, #111 0%, #0d0d0d 60%, #130808 100%)"
              : "linear-gradient(135deg, var(--color-muted) 0%, var(--color-background) 100%)",
          }}
          aria-hidden="true"
        >
          {/* Side Panel Overlay Glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${R_HEX}18 0%, transparent 70%)`,
              opacity: isDarkMode ? 1 : 0.4,
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px),
                                linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 w-full flex flex-col items-center gap-6">
            {/* Eyebrow */}
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
              style={{
                background: `${R_HEX}18`,
                border: `1px solid ${R_HEX}33`,
                color: R_HEX,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-brand" />
              AlgoNinja Platform
            </div>

            {/* Ninja SVG illustration */}
            <NinjaIllustration />

            {/* Headline under illustration */}
            <div className="text-center -mt-2">
              <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight tracking-tight arp-display">
                Master DSA. <span style={{ color: R_HEX }}>Get hired.</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2.5 max-w-xs mx-auto leading-relaxed">
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
