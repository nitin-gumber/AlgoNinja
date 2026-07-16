import React from "react";
import { motion } from "framer-motion";
import { Mail, Shield, User, Award, Zap, Target } from "lucide-react";
import Avatar from "boring-avatars";
import { PlanBadge } from "../UI/navbar/PlanBadge";

export const HeroSection = ({ user, submissionsCount, successRate }) => {
  const isAdmin = user?.role === "admin";
  const userPlan = user?.plan !== "free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl p-6 md:p-8 border border-border/60 overflow-hidden bg-linear-to-br from-brand/10 via-background to-card shadow-sm"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] backdrop-blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="relative group shrink-0">
          <Avatar
            size={100}
            name={user?.name || "Ninja"}
            variant="beam"
            colors={["#e02020", "#0a0a0a", "#94a3b8", "#1a1a1a"]}
            className="border-4 border-card rounded-full shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          {userPlan && (
            <span className="absolute -bottom-1 -right-1 bg-brand text-white p-1.5 rounded-full shadow-lg border-2 border-card">
              <Zap className="h-4 w-4 fill-current" />
            </span>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {user?.name || "Developer"}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                  isAdmin
                    ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                }`}
              >
                {isAdmin ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {user?.role?.toUpperCase() || "USER"}
              </span>
              <PlanBadge plan={user?.plan} />
            </div>
          </div>

          <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2 max-w-md">
            <Mail className="h-4 w-4 text-brand shrink-0" />
            <span className="truncate">{user?.email}</span>
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-card/60 backdrop-blur-sm border border-border/80 rounded-xl text-xs font-semibold">
              <Award className="h-4 w-4 text-brand" />
              <span>Score Weight: {submissionsCount * 10} pts</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-card/60 backdrop-blur-sm border border-border/80 rounded-xl text-xs font-semibold">
              <Target className="h-4 w-4 text-emerald-500" />
              <span>Accuracy: {successRate}%</span>
            </div>
          </div>
        </div>

        {!userPlan && (
          <button className="w-full md:w-auto mt-4 md:mt-0 px-6 py-3 bg-brand hover:bg-brand/90 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 shadow-brand/10">
            Upgrade to Premium
          </button>
        )}
      </div>
    </motion.div>
  );
};
