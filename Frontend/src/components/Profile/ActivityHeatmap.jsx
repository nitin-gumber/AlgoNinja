import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const ActivityHeatmap = ({ submissions = [] }) => {
  const heatmapData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyMap = {};

    submissions.forEach((sub) => {
      const ts = sub.createdAt || sub.createdAT;
      if (!ts) return;

      const dObj = new Date(ts);
      const subKey = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, "0")}-${String(dObj.getDate()).padStart(2, "0")}`;
      dailyMap[subKey] = (dailyMap[subKey] || 0) + 1;
    });

    const items = [];
    const totalDays = 24 * 7;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const localKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const count = dailyMap[localKey] || 0;

      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 4) level = 2;
      else if (count > 4 && count <= 6) level = 3;
      else if (count > 6) level = 4;

      items.push({ date: localKey, count, level });
    }
    return items;
  }, [submissions]);

  const levelColorMap = {
    0: "bg-muted hover:bg-muted/80",
    1: "bg-brand/20",
    2: "bg-brand/40",
    3: "bg-brand/70",
    4: "bg-brand",
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-foreground">Coding Activity</h3>
        <p className="text-xs text-muted-foreground">
          Tracking matrix metrics for past 24 weeks
        </p>
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-1.5 py-2 overflow-x-auto justify-start">
        {heatmapData.map((day, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.3 }}
            className={`w-3.5 h-3.5 rounded-sm transition-colors cursor-pointer shrink-0 ${levelColorMap[day.level]}`}
            title={`${day.count} sub missions on ${day.date}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((l) => (
            <div
              key={l}
              className={`w-2.5 h-2.5 rounded-sm ${levelColorMap[l]}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
