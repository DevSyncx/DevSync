import { CheckSquare, Clock, Settings, Menu } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: CheckSquare, label: "To do list", path: "/todo" },
  { icon: Clock, label: "Pomodoro", path: "/pomodoro" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Hamburger for small screens */}
      <div className="sm:hidden p-2 bg-blue-300">
        <button onClick={() => setOpen(!open)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } sm:block w-40 bg-blue-300 flex flex-col p-4`}
      >
        <nav className="flex flex-col gap-6">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex items-center gap-3 text-lg font-medium text-black hover:text-white transition-colors"
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
