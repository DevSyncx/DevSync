import React, { useContext } from "react";
import ThemeContext from "./theme-provider.jsx";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        border: "none",
        background: theme === "dark" ? "#222" : "#eee",
        color: theme === "dark" ? "#fff" : "#222",
        cursor: "pointer",
        fontWeight: "bold"
      }}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
