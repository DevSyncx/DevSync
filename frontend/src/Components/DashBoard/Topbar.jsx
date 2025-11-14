import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Flame, User, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import DarkModeToggle from "../ui/DarkModeToggle";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();

  const topbarItems = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Flame, label: "Streak", path: "/streak" },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between backdrop-blur-lg bg-[var(--card)]/90 border-b border-border px-4 sm:px-8 py-3 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center md:hidden text-[var(--primary)] hover:scale-110 transition-transform cursor-pointer bg-transparent border-none outline-none"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer flex items-center gap-2 group bg-transparent border-none outline-none"
        >
          <h1 className="text-lg sm:text-2xl font-bold text-[var(--primary)] tracking-tight relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--primary)] after:bottom-0 after:left-0 group-hover:after:w-full after:transition-all after:duration-300">
            DevSync
          </h1>
        </button>
      </div>

      {/* Icons + Avatar + DarkMode */}
      <div className="flex items-center gap-4 sm:gap-6">
        {topbarItems.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="relative group text-[var(--primary)] transition-all bg-transparent border-none outline-none cursor-pointer"
            aria-label={label}
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--primary)] group-hover:w-full transition-all duration-300 rounded-full"></span>
          </button>
        ))}

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative group bg-transparent border-none outline-none cursor-pointer p-0">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--primary)] group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--primary)] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[160px] sm:min-w-[200px] shadow-lg border border-border rounded-lg bg-[var(--card)] backdrop-blur-md"
          >
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark Mode Toggle */}
        <DarkModeToggle />
      </div>
    </header>
  );
}
