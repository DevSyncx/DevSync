import { useState } from "react";

export default function FloatingSupportButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://buymeacoffee.com/annanyatiw1"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed bottom-6 left-12 z-50 flex flex-col items-center justify-center w-24 h-24 text-black font-semibold shadow-lg transition-all duration-300
       
        ${hovered ? "scale-125 shadow-2xl animate-pulse" : ""}`}
    >
      {/* Coffee GIF */}
      <img
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmE4ZG1pMzRqamxwcmhhaTlyYm9hNTh5aTZ3M3l5NjJ3N3lrazB6aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/TDQOtnWgsBx99cNoyH/giphy.gif"
        alt="Buy me a coffee"
        className="w-16 h-16 rounded-full"
      />

      {/* Tooltip / Label */}
      <div
        className={`absolute bottom-full mb-3 px-3 py-1 rounded-lg shadow-lg text-white font-medium text-sm bg-black transition-all duration-300
          ${hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
      >
        Buy me a coffee!
      </div>

      {/* Optional hover glow */}
      <span
        className={`absolute inset-0 rounded-full opacity-20 pointer-events-none transition-all duration-300
          ${hovered ? "scale-125 opacity-40 bg-yellow-300 dark:bg-yellow-500" : "scale-100 opacity-20"}`}
      ></span>
    </a>
  );
}
