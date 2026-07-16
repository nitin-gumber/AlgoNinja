import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const ProgressChart = ({ submissions = [] }) => {
  const chartData = useMemo(() => {
    const dailyData = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const localKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      dailyData[localKey] = {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        solved: 0,
        attempted: 0,
      };
    }

    submissions.forEach((sub) => {
      const ts = sub.createdAt;
      if (!ts) return;

      const dObj = new Date(ts);
      const subKey = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, "0")}-${String(dObj.getDate()).padStart(2, "0")}`;

      if (dailyData[subKey]) {
        dailyData[subKey].attempted += 1;
        if (sub.status?.toUpperCase() === "ACCEPTED") {
          dailyData[subKey].solved += 1;
        }
      }
    });

    return Object.values(dailyData);
  }, [submissions]);

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-foreground">
        30-Day Performance History
      </h3>
      <div className="w-full h-80 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAttempted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5b210" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f5b210" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
              opacity={0.4}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--foreground)" }}
              stroke="transparent"
            />
            <YAxis
              tick={{ fill: "var(--foreground)" }}
              allowDecimals={false}
              stroke="transparent"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "12px",
                color: "var(--color-text-main)",
              }}
            />
            <Area
              type="monotone"
              dataKey="attempted"
              stroke="#f5b210"
              fillOpacity={1}
              fill="url(#colorAttempted)"
              strokeWidth={2}
              name="Attempted"
            />
            <Area
              type="monotone"
              dataKey="solved"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorSolved)"
              strokeWidth={2}
              name="Solved"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
