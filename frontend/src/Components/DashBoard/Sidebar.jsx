import React, { useState, useEffect } from "react";
import { CheckSquare, Clock, Settings, MessageSquare, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFeedback } from "@/context/FeedbackContext";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: CheckSquare, label: "To do list", path: "/todo" },
  { icon: Clock, label: "Pomodoro", path: "/pomodoro" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openFeedbackPopup } = useFeedback();
  const [width, setWidth] = useState(200); // desktop default width
  const [resizing, setResizing] = useState(false);

  // Desktop resize logic
  const startResizing = (e) => {
    setResizing(true);
    e.preventDefault();
  };
  const stopResizing = () => setResizing(false);
  const handleResizing = (e) => {
    if (resizing) {
      const newWidth = Math.min(Math.max(e.clientX, 160), 320);
      setWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleResizing);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", handleResizing);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resizing]);

  // Calculate icon size based on width (min 18px, max 24px)
  const iconSize = Math.min(Math.max((width / 200) * 22, 18), 24);

  return (
    <>
      {/* Mobile Sidebar with Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black backdrop-blur-sm z-40 sm:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-64 bg-[var(--sidebar)] shadow-lg z-50 sm:hidden overflow-y-auto p-4"
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1 text-[var(--primary)] hover:text-[var(--secondary)] transition"
                aria-label="Close Sidebar"
              >
                <X size={24} />
              </button>

              <SidebarNav
                navigate={navigate}
                pathname={pathname}
                openFeedbackPopup={openFeedbackPopup}
                iconSize={22} // mobile icons fixed
                onClose={onClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className="hidden sm:flex flex-col bg-[var(--sidebar)] shadow-inner border-r border-border relative"
        style={{ width }}
      >
        <div className="flex-1 p-4">
          <SidebarNav
            navigate={navigate}
            pathname={pathname}
            openFeedbackPopup={openFeedbackPopup}
            iconSize={iconSize} // responsive icon size
          />
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={startResizing}
          className="absolute right-0 top-0 h-full w-2 cursor-ew-resize bg-transparent hover:bg-[var(--primary)]/30 transition"
        />
      </aside>
    </>
  );
}

function SidebarNav({ navigate, pathname, openFeedbackPopup, onClose, iconSize = 22 }) {
  const navItems = [
    ...menuItems,
    { icon: MessageSquare, label: "Feedback", onClick: openFeedbackPopup },
  ];

  return (
    <nav className="flex flex-col gap-2 mt-8">
      {navItems.map(({ icon: Icon, label, path, onClick }) => {
        const isActive = path && pathname === path;

        return (
          <motion.button
            key={label}
            onClick={() => {
              if (path) navigate(path);
              else onClick();
              onClose?.(); // close sidebar on mobile after click
            }}
            whileHover={{ scale: 1.05 }}
            className={`group relative flex items-center gap-3 px-3 py-2 rounded-md font-medium text-[var(--sidebar-foreground)] transition-all cursor-pointer select-none
              ${isActive
                ? "bg-[var(--secondary)] text-[var(--primary)]"
                : "hover:text-[var(--primary)] hover:bg-[var(--secondary)]/60"
              }`}
          >
            <Icon size={iconSize} />
            <span
              className="truncate"
              style={{ fontSize: Math.min(Math.max((iconSize / 22) * 14, 12), 16) }}
            >
              {label}
            </span>

            {/* Hover underline animation */}
            <span
              className={`absolute bottom-1 left-3 h-[2px] bg-[var(--primary)] rounded-full transition-all duration-300 ${
                isActive
                  ? "w-[calc(100%-1.5rem)]"
                  : "w-0 group-hover:w-[calc(100%-1.5rem)]"
              }`}
            />
          </motion.button>
        );
      })}
    </nav>
  );
}
