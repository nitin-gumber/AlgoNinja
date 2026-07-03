import React from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown } from "lucide-react";

export const MenuDropdown = ({ label, items }) => {
  const location = useLocation();
  const isActive = items.some((item) => location.pathname === item.to);

  return (
    <div className="dropdown dropdown-hover group">
      {/* Trigger */}
      <div
        tabIndex={0}
        role="button"
        className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer py-2 satoshi ${
          isActive
            ? "text-brand font-semibold"
            : "text-foreground/70 group-hover:text-brand"
        }`}
      >
        <span>{label}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180 group-hover:text-brand" />
      </div>

      {/* Content Menu — Fixed with an invisible hover bridge for zero layout collapse */}
      <ul
        tabIndex={0}
        className="dropdown-content menu p-3 mt-3 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-[400px] gap-1 z-50 origin-top transform scale-95 opacity-0 pointer-events-none transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto
                   before:absolute before:inset-x-0 before:-top-4 before:h-4 before:content-['']"
      >
        {items.map((item) => {
          const isItemActive = location.pathname === item.to;
          return (
            <li key={item.title}>
              <Link
                to={item.to}
                className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-200 group/link ${
                  isItemActive
                    ? "bg-brand/10 text-brand border border-brand/20 font-semibold"
                    : "text-foreground/80 hover:bg-muted border border-transparent hover:border-border/30"
                }`}
              >
                <div className="mt-0.5 shrink-0 transition-transform duration-200 group-hover/link:scale-110">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-foreground">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium whitespace-normal leading-normal">
                    {item.description}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};