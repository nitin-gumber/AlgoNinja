import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem("theme") !== "light",

  toggleTheme: () =>
    set((state) => {
      const nextMode = !state.isDarkMode;
      localStorage.setItem("theme", nextMode ? "dark" : "light");

      const root = window.document.documentElement;
      if (nextMode) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      return { isDarkMode: nextMode };
    }),

  initTheme: () => {
    const isDark = localStorage.getItem("theme") !== "light";
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  },
}));
