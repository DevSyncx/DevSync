import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Flame, User } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Avatar } from "@/Components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import DarkModeToggle from "../ui/DarkModeToggle";

export default function Topbar() {
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
    <header className="flex items-center justify-between bg-[var(--card)] px-3 sm:px-6 py-3 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <h1 className="text-lg sm:text-2xl font-bold text-[var(--primary)] flex-shrink-0">
        DevSync
      </h1>

      {/* Icons + Avatar + DarkMode */}
      <div className="flex items-center gap-1 sm:gap-4">
        {topbarItems.map(({ icon: Icon, label, path }) => (
          <Button
            key={label}
            variant="ghost"
            onClick={() => navigate(path)}
            className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border border-transparent hover:border-[var(--primary)] hover:bg-[var(--secondary)] transition-all shadow-md flex items-center justify-center"
            aria-label={label}
          >
            <Icon className="w-4 h-4 sm:w-8 sm:h-8 text-[var(--primary)]" />
          </Button>
        ))}

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border border-transparent hover:border-[var(--primary)] hover:bg-[var(--secondary)] transition-all shadow-md flex items-center justify-center"
            >
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary)] translate-y-2 sm:translate-y-3 translate-x-2 sm:translate-x-3" />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[160px] sm:min-w-[200px] shadow-lg border border-border rounded-md bg-[var(--card)]"
          >
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DarkModeToggle />
      </div>
    </header>
  );
}
