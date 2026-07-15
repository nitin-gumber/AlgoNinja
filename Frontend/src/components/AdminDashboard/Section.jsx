import React from "react";

export const Section = ({ icon: Icon, title, badge, children }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/30 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-card/50">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-4 w-4 text-brand" aria-hidden="true" />}
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
        </div>
        {badge}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};
