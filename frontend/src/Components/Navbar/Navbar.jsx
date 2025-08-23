import React, { useEffect, useState } from "react";
import { Github, Home, Info, Sparkle, LogIn, UserPlus, UserCircle, Clock } from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

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
    name: "Pomodoro", 
    link: "/pomodoro",
    icon: <Clock className="h-4 w-4" />,
    internal: true,
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#E4ECF1]/80 to-[#D2DEE7]/80 backdrop-blur-xl border-b border-[#C5D7E5] px-6 py-4 shadow-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2E3A59] to-[#2E3A59]">
                DevSync
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) =>
                item.internal ? (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.link}
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                    target={item.link.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                )
              )}

              {/* Auth links */}
              <div className="flex items-center gap-3 ml-4">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-6 py-2 bg-[#2E3A59] text-white rounded-lg hover:bg-[#6366f1] transition duration-200"
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#2E3A59] font-semibold text-base"
              >
                Menu
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-3 px-4 pb-4">
              {navItems.map((item) =>
                item.internal ? (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.link}
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                    target={item.link.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                )
              )}

              {/* Auth links mobile */}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#C5D7E5]">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-4 py-2 bg-[#2E3A59] text-white rounded-lg hover:bg-[#6366f1] transition duration-200 w-fit"
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

