import { Bell, Flame, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";

const topbarItems = [
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Flame, label: "Streak", path: "/streak" },
  { icon: User, label: "Profile", path: "/profile" },
];

function Topbar() {
  const navigate = useNavigate();

  return (
  <header className="flex items-center justify-between bg-[var(--card)] px-6 py-3 shadow-md">
      {/* Logo */}
  <h1 className="text-xl font-bold text-[var(--primary)]">DevSync</h1>

      {/* Right: Dynamic Icons */}
      <div className="flex items-center gap-2">
        {topbarItems.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="p-2 hover:bg-[var(--accent)] rounded-full"
            aria-label={label}
          >
            <Icon className="w-5 h-5 text-[var(--primary)]" />
          </button>
        ))}
        <DarkModeToggle/>
      </div>
    </header>
  );
}

export default Topbar;
