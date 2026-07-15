import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useProblemStore } from "../store/useProblemStore";
import { AdminProblemTable } from "../components/AdminDashboard/AdminProblemTable";
import { DeleteConfirmModal } from "../components/UI/Models/DeleteConfirmModal";
import { Spinner } from "../components/Spinner";
import {
  Plus,
  LayoutDashboard,
  Shield,
  FolderGit2,
  Code,
  Database,
  RefreshCw,
} from "lucide-react";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    authUser,
    isLoading: isAuthLoading,
  } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const {
    problems,
    getAllProblems,
    isLoading: isProblemsLoading,
  } = useProblemStore();

  const [targetEvictionId, setTargetEvictionId] = useState(null);

  useEffect(() => {
    if (isAuthenticated && authUser?.role === "admin") {
      getAllProblems();
    }
  }, [isAuthenticated, authUser, getAllProblems]);

  if (isAuthLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300"
        style={{
          backgroundColor: isDarkMode ? "#0a0a0a" : "var(--color-background)",
        }}
      >
        <div className="text-base font-semibold flex items-center gap-3 satoshi">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (authUser?.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  const handleRoutingRedirectToFormPage = (mode, problemId = null) => {
    if (mode === "edit" && problemId) {
      navigate(`/admin/update-problem/${problemId}`);
    } else {
      navigate("/admin/add-problem");
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground py-10 px-4 relative overflow-hidden mt-16"
      style={{
        backgroundColor: isDarkMode ? "#0a0a0a" : "var(--color-background)",
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      {/* ── Dynamic Reddish Accent Ambient Light Blur Core System ── */}
      <div
        className="absolute top-0 right-1/3 translate-x-1/2 w-150 h-65 pointer-events-none z-0 transition-opacity duration-500 rounded-full"
        style={{
          background: isDarkMode
            ? `radial-gradient(circle, oklch(0.6 0.25 25 / 8%) 0%, transparent 80%)`
            : `radial-gradient(circle, oklch(0.6 0.25 25 / 3%) 0%, transparent 80%)`,
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10 animate-in fade-in duration-300">
        {/* ── Top Level Context Control Header Matrix ── */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3 arp-display">
              <LayoutDashboard className="w-8 h-8 text-brand" />
              <span>Admin Dashboard</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium max-w-xl leading-relaxed satoshi">
              Welcome to your workspace creator dashboard. Here you can easily
              add new practice questions, update existing code scripts, or
              manage the current list of tasks for your users.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleRoutingRedirectToFormPage("add")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-brand text-white shadow-lg shadow-brand/10 hover:shadow-brand/20 hover:opacity-95 transition-all duration-200 active:scale-[0.98] cursor-pointer text-center satoshi"
          >
            <Plus className="h-4 w-4 stroke-3" />
            <span>Create New Challenge</span>
          </button>
        </header>

        {/* ── Bento Metrics Operational Analytics Cards Row ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 text-foreground satoshi">
          <div className="p-5 bg-card/60 border border-border/70 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <Code className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black">
                {problems?.length || 0}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Total Live Challenges
              </span>
            </div>
          </div>
          <div className="p-5 bg-card/60 border border-border/70 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Database className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className=" flex gap-1">
                <span className="text-2xl font-black">Online </span>{" "}
                <div className="animate-pulse bg-green-600 h-2 w-2 rounded mt-2"></div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Judge0 Core Status
              </span>
            </div>
          </div>
          <div className="p-5 bg-card/60 border border-border/70 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black">Authorized</span>
              <span className="text-xs font-semibold text-muted-foreground">
                Profile Clearance Tier
              </span>
            </div>
          </div>
        </section>

        {/* ── Segment Controller Tabs Space ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Quick Refresh Database Trigger Button Action */}
            <button
              type="button"
              disabled={isProblemsLoading}
              onClick={() => getAllProblems()}
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-brand transition-colors p-2 bg-card border border-border/60 rounded-xl cursor-pointer disabled:opacity-40"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isProblemsLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh Pool</span>
            </button>
          </div>

          {/* ── Structural Content Panel Switcher Channels ── */}
          <main className="w-full">
            {isProblemsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-2 satoshi">
                {/* Loader */}
                <Spinner />
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <AdminProblemTable
                  problems={problems}
                  onEditSelect={(id) =>
                    handleRoutingRedirectToFormPage("edit", id)
                  }
                  onDeleteSelect={(id) => setTargetEvictionId(id)}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Transactional Confirmation Backdrop Overlay Panel Loader ── */}
      {targetEvictionId && (
        <DeleteConfirmModal
          problemId={targetEvictionId}
          onClose={() => setTargetEvictionId(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
