import React, { useEffect, useState } from "react";
import { Github, Home, Info, Sparkle, LogIn, UserPlus, UserCircle } from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

import DarkModeToggle from "../ui/DarkModeToggle";

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="h-4 w-4" />,
  },
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
];

const Navbar = () => {
  const [showFloating, setShowFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <div className="w-full font-sans">
      {!showFloating && (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 shadow-md"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <h1 className="text-4xl font-extrabold" style={{ color: "var(--primary)" }}>
                DevSync
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
              <div className="flex items-center gap-3 ml-4">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                    style={{ color: "var(--primary)" }}
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 transition duration-200"
                      style={{ color: "var(--primary)" }}
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-6 py-2 rounded-lg transition duration-200"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </>
                )}
                  <DarkModeToggle />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="font-semibold text-base"
                style={{ color: "var(--primary)" }}
              >
                Menu
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-3 px-4 pb-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
                    style={{ color: "var(--primary)" }}
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 transition duration-200"
                      style={{ color: "var(--primary)" }}
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 w-fit"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {showFloating && <FloatingNav navItems={navItems} />}
    </div>
  );
};

export default Navbar;
