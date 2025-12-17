import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "theme";

export const useTheme = () => {
  const getInitialTheme = (): Theme => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    if (storedTheme) return storedTheme;

    // system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Optional: react to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem(THEME_KEY);
      if (!storedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return {
    theme,
    setTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
};
