import React from "react";
import { motion } from "framer-motion";

export const StatCard = ({
  title,
  value,
  secondaryValue,
  icon,
  color = "yellow",
  isStreak = false,
}) => {
  const tintMap = {
    yellow: "text-amber-500 bg-amber-500/10",
    green: "text-emerald-500 bg-emerald-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    blue: "text-blue-500 bg-blue-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group flex items-center gap-4 transition-all duration-200"
    >
      <div
        className={`p-3.5 rounded-xl ${tintMap[color] || tintMap.yellow} shrink-0`}
      >
        {React.cloneElement(icon, { className: "h-6 w-6 stroke-[2]" })}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest truncate">
          {title}
        </p>

        {isStreak ? (
          <div className="flex items-baseline justify-between mt-1 gap-2">
            <div>
              <span className="text-2xl font-black text-foreground">
                {value}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold ml-1">
                Current
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-muted-foreground">
                {secondaryValue}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold ml-1">
                Max
              </span>
            </div>
          </div>
        ) : (
          <h3 className="text-2xl font-black text-foreground mt-0.5">
            {title === "Success Rate" ? `${value || 0}%` : value || 0}
          </h3>
        )}
      </div>
    </motion.div>
  );
};
