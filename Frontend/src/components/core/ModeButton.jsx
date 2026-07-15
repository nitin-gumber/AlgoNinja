import React from "react";
import { useThemeStore } from "../../store/useThemeStore";
import {Moon,Sun} from "lucide-react"

export const ModeButton = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none"
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-amber-500 animate-pulse" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-500" />
      )}
    </button>
  );
};
