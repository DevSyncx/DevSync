import React, { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import ThemeContext from "./theme-provider.jsx";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer hover:scale-110   ${
        isDark
          ? "bg-[ --background]"
          : "bg-[--foreground]"
      }`}
    >
      {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </button>
  );
}
