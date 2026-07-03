import React from "react";
import { ShieldCheck, Zap } from "lucide-react";

export const PlanBadge = ({ plan, isMobile = false }) => {
  const isPremium = plan === "premium";
  const label = isPremium ? "Premium" : "Pro";
  const icon = isPremium ? (
    <ShieldCheck className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
  ) : (
    <Zap className="h-3.5 w-3.5 text-red-400" />
  );

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold text-white bg-gradient-to-r tracking-wider select-none transform hover:scale-105 transition-all duration-300 ${
        isPremium
          ? "from-neutral-900 via-amber-950 to-neutral-900 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
          : "from-neutral-900 via-red-950 to-neutral-900 border border-red-500/30 shadow-[0_0_12px_rgba(224,32,32,0.15)]"
      } ${isMobile ? "text-sm px-4 py-2" : ""}`}
      role="status"
    >
      {icon}
      <span className="ml-2 satoshi">{label}</span>
    </div>
  );
};
