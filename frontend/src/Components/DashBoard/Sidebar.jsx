import React from "react";
import { CheckSquare, Clock, Settings, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { Button } from "@/Components/ui/button";

const menuItems = [
  { icon: CheckSquare, label: "To do list", path: "/todo" },
  { icon: Clock, label: "Pomodoro", path: "/pomodoro" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Sidebar: Sheet */}
      <div className="sm:hidden p-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-14 h-14 flex items-center justify-center rounded-full shadow-md hover:bg-[var(--secondary)] transition-colors"
            >
              <Menu size={28} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <nav className="flex flex-col gap-3">
              {menuItems.map(({ icon: Icon, label, path }) => (
                <Button
                  key={label}
                  variant="ghost"
                  onClick={() => navigate(path)}
                  className="flex items-center gap-3 w-full justify-start p-3 rounded-md text-lg font-medium hover:bg-[var(--secondary)] transition-colors shadow-sm"
                >
                  <Icon size={24} />
                  {label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex w-48 flex-col p-4 bg-[var(--sidebar)] h-full shadow-inner">
        <nav className="flex flex-col gap-3">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Button
              key={label}
              variant="ghost"
              onClick={() => navigate(path)}
              className="flex items-center gap-3 w-full justify-start p-3 rounded-md text-lg font-medium text-[var(--sidebar-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary)] transition-colors shadow-sm"
            >
              <Icon size={24} />
              {label}
            </Button>
          ))}
        </nav>
      </aside>
    </>
  );
}
