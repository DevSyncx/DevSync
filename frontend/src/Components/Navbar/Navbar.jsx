// src/Components/Navbar/Navbar.jsx
import React, { useEffect, useState } from "react";
import { UserCircle, Clock, Home, Sparkle, Info, Github, Phone, MessageCircle, MessageSquarePlus } from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";
import { useFeedback } from "../../context/FeedbackContext";
import FeedbackButton from "../feedback/FeedbackButton";
import { useTimer } from "../../context/TimerContext";

const publicNavItems = [
  { name: "Home", link: "/", icon: <Home className="h-4 w-4" /> },
  { name: "Features", link: "#features", icon: <Sparkle className="h-4 w-4" /> },
  { name: "About us", link: "#about", icon: <Info className="h-4 w-4" /> },
  { name: "Github", link: "https://github.com/DevSyncx/DevSync.git", icon: <Github className="h-4 w-4" /> },
  { name: "Contact Us", link: "#contact", icon: <Phone className="h-4 w-4" /> },
  { name: "View Feedback", link: "/feedback", icon: <MessageCircle className="h-4 w-4" /> },
];

const Navbar = () => {
  const [showFloating, setShowFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayTime, setDisplayTime] = useState("25:00");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const { openFeedbackPopup } = useFeedback();

  const navigate = useNavigate();
  const { timeLeft, isRunning } = useTimer();

  useEffect(() => {
    const handleScroll = () => setShowFloating(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const seconds = String(timeLeft % 60).padStart(2, "0");
      setDisplayTime(`${minutes}:${seconds}`);
    }, 500);
    return () => clearInterval(interval);
  }, [timeLeft, isRunning]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="w-full font-sans">
      {!showFloating && (
        <header
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 shadow-md"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link to="/">
              <h1 className="text-4xl font-extrabold" style={{ color: "var(--primary)" }}>
                DevSync
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {!isAuthenticated && (
                <>
                  {publicNavItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.link}
                      className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                      style={{ color: "var(--card-foreground)" }}
                    >
                      {item.icon} {item.name}
                    </a>
                  ))}
                  <FeedbackButton />
                </>
              )}

              {isAuthenticated && isRunning && (
                <div
                  onClick={() => navigate("/pomodoro")}
                  className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-mono">{displayTime}</span>
                </div>
              )}

              {isAuthenticated && (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                    style={{ color: "var(--primary)" }}
                  >
                    <UserCircle className="h-4 w-4" /> Profile
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <Link
                      to="/feedback"
                      className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                      style={{ color: "var(--primary)" }}
                    >
                      <MessageCircle className="h-4 w-4" /> View Feedback
                    </Link>
                    <button
                      onClick={openFeedbackPopup}
                      className="flex items-center gap-2 text-[17px] font-medium transition duration-200 mt-2 sm:mt-0"
                      style={{ color: "var(--accent)" }}
                    >
                      <MessageSquarePlus className="h-4 w-4" /> Give Feedback
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-[17px] font-medium transition duration-200 text-red-500"
                  >
                    Logout
                  </button>
                  <DarkModeToggle />
                </div>
              )}

              {!isAuthenticated && (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 transition duration-200"
                    style={{ color: "var(--primary)" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-6 py-2 rounded-lg transition duration-200"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    Sign Up
                  </Link>
                  <DarkModeToggle />
                </div>
              )}
            </nav>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative w-8 h-6 flex flex-col justify-between items-center"
              >
                <span
                  className={`block h-1 w-full bg-current rounded transform transition duration-300 ease-in-out ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-1 w-full bg-current rounded transition duration-300 ease-in-out ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-1 w-full bg-current rounded transform transition duration-300 ease-in-out ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div className="mt-4 flex flex-col gap-3 px-4 pb-4">
                  {!isAuthenticated ? (
                    <>
                      {publicNavItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.link}
                          className="flex items-center gap-2 text-[17px] font-medium"
                          style={{ color: "var(--card-foreground)" }}
                        >
                          {item.icon} {item.name}
                        </a>
                      ))}
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 transition duration-200"
                        style={{ color: "var(--primary)" }}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-2 px-6 py-2 rounded-lg transition duration-200"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        Sign Up
                      </Link>
                      <DarkModeToggle />
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 text-[17px] font-medium"
                        style={{ color: "var(--primary)" }}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/feedback"
                        className="flex items-center gap-2 text-[17px] font-medium"
                        style={{ color: "var(--primary)" }}
                      >
                        <MessageCircle className="h-4 w-4" /> View Feedback
                      </Link>
                      <button
                        onClick={openFeedbackPopup}
                        className="flex items-center gap-2 text-[17px] font-medium mt-2"
                        style={{ color: "var(--accent)" }}
                      >
                        <MessageSquarePlus className="h-4 w-4" /> Give Feedback
                      </button>
                      {isRunning && (
                        <div
                          onClick={() => navigate("/pomodoro")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-mono">{displayTime}</span>
                        </div>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-[17px] font-medium text-red-500"
                      >
                        Logout
                      </button>
                      <DarkModeToggle />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {showFloating && <FloatingNav navItems={!isAuthenticated ? publicNavItems : []} />}
    </div>
  );
};

export default Navbar;
