// src/Components/Navbar/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Github, Home, Info, Sparkle, LogIn, UserPlus, UserCircle, Phone, Clock } from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";
import { useTimer } from "../../context/TimerContext";

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="h-4 w-4" />,
    internal: true,
  },
  {
    name: "Features",
    link: "#features",
    icon: <Sparkle className="h-4 w-4" />,
    internal: false,
  },
  {
    name: "About us",
    link: "#about",
    icon: <Info className="h-4 w-4" />,
    internal: false,
  },
  {
    name: "Github",
    link: "https://github.com/DevSyncx/DevSync.git",
    icon: <Github className="h-4 w-4" />,
    internal: false,
  },
  {
    name: "Contact Us",
    link: "#contact",
    icon: <Phone className="h-4 w-4" />,
    internal: false,
  },
];

const Navbar = () => {
  const [showFloating, setShowFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayTime, setDisplayTime] = useState("25:00");
  const navigate = useNavigate();
  const { timeLeft } = useTimer();

  // Update floating nav visibility
  useEffect(() => {
    const handleScroll = () => setShowFloating(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update mini timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const seconds = String(timeLeft % 60).padStart(2, "0");
      setDisplayTime(`${minutes}:${seconds}`);
    }, 500); // update twice per second for smoother display
    return () => clearInterval(interval);
  }, [timeLeft]);

  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <div className="w-full font-sans">
      {!showFloating && (
        <header
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 shadow-md"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link to="/">
              <h1 className="text-4xl font-extrabold" style={{ color: "var(--primary)" }}>DevSync</h1>
            </Link>

            <nav className="hidden md:flex space-x-8 items-center">
              {navItems.map(item => (
                <a
                  key={item.name}
                  href={item.link}
                  className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {item.icon} {item.name}
                </a>
              ))}

              {/* Mini Pomodoro Timer */}
              <div
                onClick={() => navigate("/pomodoro")}
                className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-mono">{displayTime}</span>
              </div>

              <div className="flex items-center gap-3 ml-4">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                    style={{ color: "var(--primary)" }}
                  >
                    <UserCircle className="h-4 w-4" /> Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 transition duration-200"
                      style={{ color: "var(--primary)" }}
                    >
                      <LogIn className="h-4 w-4" /> Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-6 py-2 rounded-lg transition duration-200"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      <UserPlus className="h-4 w-4" /> Sign Up
                    </Link>
                  </>
                )}
                <DarkModeToggle />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="font-semibold text-base" style={{ color: "var(--primary)" }}>
                Menu
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-3 px-4 pb-4">
              {navItems.map(item => (
                <a
                  key={item.name}
                  href={item.link}
                  className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {item.icon} {item.name}
                </a>
              ))}
            </div>
          )}
        </header>
      )}

      {showFloating && <FloatingNav navItems={navItems} />}
    </div>
  );
};

export default Navbar;

