import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Clock,
  Sparkle,
  Info,
  Github,
  Phone,
  HelpCircle,
  X,
} from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";
import { useTimer } from "../../context/TimerContext";
// import "./MobileNav.css"; // Import the new CSS file - REMOVED

const publicNavItems = [
  {
    name: "Features",
    link: "#features",
    icon: <Sparkle className="h-4 w-4" />,
  },
  {
    name: "About us",
    link: "#about",
    icon: <Info className="h-4 w-4" />,
  },
  {
    name: "Github",
    link: "https://github.com/DevSyncx/DevSync.git",
    icon: <Github className="h-4 w-4" />,
  },
  {
    name: "Contact Us",
    link: "#contact",
    icon: <Phone className="h-4 w-4" />,
  },
  {
    name: "FAQ",
    link: "#faq",
    icon: <HelpCircle className="h-4 w-4" />,
  },
];

// --- Mobile Navigation Overlay Component ---
// Kept in the same file for simplicity
const MobileNavOverlay = ({ isOpen, onClose, navItems, isAuthenticated, handleLogout }) => {
  const overlayClasses = `mobile-nav-overlay ${isOpen ? "open" : ""}`;

  const handleLinkClick = () => {
    onClose();
  };
  
  const handleLogoutClick = () => {
    handleLogout();
    onClose();
  }

  return (
    <div className={overlayClasses}>
      <button onClick={onClose} className="close-btn">
        <X size={32} />
      </button>

      <nav>
        <ul>
          {!isAuthenticated ? (
            navItems.map((item) => (
              <li key={item.name}>
                <a href={item.link} onClick={handleLinkClick}>
                  {item.name}
                </a>
              </li>
            ))
          ) : (
            <>
              <li>
                <Link to="/profile" onClick={handleLinkClick}>
                  Profile
                </Link>
              </li>
              {/* You can add more authenticated user links here */}
            </>
          )}
        </ul>
      </nav>

      <div className="mobile-nav-footer">
        {!isAuthenticated ? (
          <>
            <Link to="/register" className="w-full">
              <button onClick={handleLinkClick} className="signup-btn-mobile">
                Sign Up
              </button>
            </Link>
            <DarkModeToggle />
          </>
        ) : (
          <>
            <button onClick={handleLogoutClick} className="logout-btn-mobile">
              Logout
            </button>
            <DarkModeToggle />
          </>
        )}
      </div>
    </div>
  );
}; 


// --- Main Navbar Component ---
const Navbar = () => {
  const [showFloating, setShowFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayTime, setDisplayTime] = useState("25:00");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

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
    const handleStorageChange = () =>
      setIsAuthenticated(!!localStorage.getItem("token"));
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
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-4 md:px-6 py-3 md:py-4 shadow-md"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="mx-auto mr-1 flex max-w-7xl items-center justify-between">
            <Link to="/">
              <h1
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-300"
                style={{ color: "var(--primary)" }}
              >
                DevSync
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 lg:space-x-8 items-center">
               {!isAuthenticated &&
                 publicNavItems.map((item) => (
                   <a
                     key={item.name}
                     href={item.link}
                     className="relative text-[15px] md:text-[16px] lg:text-[17px] font-medium transition-all duration-300 group flex items-center gap-2"
                     style={{ color: "var(--card-foreground)" }}
                   >
                     {item.icon} <span>{item.name}</span>
                     <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-purple-500 transition-all duration-500 group-hover:w-full"></span>
                   </a>
                 ))}

               {isAuthenticated && isRunning && (
                 <div
                   onClick={() => navigate("/pomodoro")}
                   className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md hover:shadow-[var(--primary)]/30"
                 >
                   <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                   <span className="text-sm font-mono">{displayTime}</span>
                 </div>
               )}

               {isAuthenticated ? (
                 <div className="flex items-center gap-3 ml-4">
                   <Link
                     to="/profile"
                     className="flex items-center gap-2 text-[16px] lg:text-[17px] font-medium relative group"
                     style={{ color: "var(--primary)" }}
                   >
                     <UserCircle className="h-4 w-4" /> <span>Profile</span>
                     <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-purple-500 transition-all duration-500 group-hover:w-full"></span>
                   </Link>
                   <button
                     onClick={handleLogout}
                     className="text-[16px] lg:text-[17px] font-medium text-red-500 transition-colors duration-300 hover:text-red-600"
                   >
                     Logout
                   </button>
                   <DarkModeToggle />
                 </div>
               ) : (
                 <div className="flex items-center gap-3 ml-4">
                   <Link to="/register">
                     <button className="px-4 md:px-5 lg:px-6 py-2 rounded-md font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer text-sm md:text-base">
                       Sign Up
                     </button>
                   </Link>
                   <DarkModeToggle />
                 </div>
               )}
            </nav>

            {/* Mobile & Tablet Hamburger */}
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative w-8 h-6 flex flex-col justify-between items-center z-[110]" // Higher z-index for the button
              >
                <span
                  className={`block h-1 w-full rounded transform transition duration-300 ease-in-out ${
                    menuOpen ? "rotate-45 translate-y-[9px] bg-white" : "bg-current"
                  }`}
                />
                <span
                  className={`block h-1 w-full bg-current rounded transition duration-300 ease-in-out ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-1 w-full rounded transform transition duration-300 ease-in-out ${
                    menuOpen ? "-rotate-45 -translate-y-[9px] bg-white" : "bg-current"
                  }`}
                />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Render the full-screen overlay */}
      <MobileNavOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={publicNavItems}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />

      {showFloating && (
        <FloatingNav navItems={!isAuthenticated ? publicNavItems : []} />
      )}
    </div>
  );
};

export default Navbar;

