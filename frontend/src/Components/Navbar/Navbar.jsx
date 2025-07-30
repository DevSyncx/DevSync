import React, { useEffect, useState } from "react";
import { Github, Home, Info, Sparkle, Mail, Phone } from "lucide-react"; // Ensure all necessary icons are imported
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FloatingNav } from "../ui/floating-navbar"; // Ensure this import path is correct for .jsx or .tsx

// Define navigation items.
// 'to' property is used for react-router-dom Link component.
// 'link' property is used for external URLs.
const navItems = [
  {
    name: "Home",
    to: "/", // Path for react-router-dom
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: "Features",
    to: "/features", // Path for react-router-dom
    icon: <Sparkle className="h-4 w-4" />,
  },
  {
    name: "About us",
    to: "/about", // Path for react-router-dom
    icon: <Info className="h-4 w-4" />,
  },
  {
    name: "Contact Us", // Resolved to keep this entry
    to: "/contact", // Path for react-router-dom
    icon: <Phone className="h-4 w-4" />, // Using Phone icon for Contact
  },
  {
    name: "Github",
    link: "https://github.com/DevSyncx/DevSync.git", // External link still uses 'link'
    icon: <Github className="h-4 w-4" />,
  },
];

/**
 * Navbar component responsible for site navigation.
 * It renders a fixed header and a floating navigation bar based on scroll position.
 * It now uses react-router-dom's Link component for internal navigation.
 */
const Navbar = () => { // Removed onPageChange prop
  const [showFloating, setShowFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Effect to control the visibility of the floating navigation bar based on scroll.
  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prepare navigation items for FloatingNav.
  // FloatingNav needs to be updated to use 'to' for internal links or 'link' for external.
  // We'll pass 'to' as 'link' for FloatingNav's internal logic.
  const floatingNavItems = navItems.map(item => {
    if (item.link) { // External link
      return item;
    } else { // Internal link
      return {
        ...item,
        link: item.to // Map 'to' to 'link' for FloatingNav's expected prop
      };
    }
  });

  return (
    <div className="w-full font-sans">
      {/* Fixed header navigation, visible when not scrolled much */}
      {!showFloating && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#E4ECF1]/80 to-[#D2DEE7]/80 backdrop-blur-xl border-b border-[#C5D7E5] px-6 py-4 shadow-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2E3A59] to-[#2E3A59]">
              DevSync
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                item.link ? ( // Check for external link
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ) : ( // Use Link for internal navigation
                  <Link
                    key={item.name}
                    to={item.to}
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                    onClick={() => setMenuOpen(false)} // Close mobile menu on click
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#2E3A59] font-semibold text-base"
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu (Conditional Rendering) */}
          {menuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-3 px-4 pb-4">
              {navItems.map((item) => (
                item.link ? ( // Check for external link
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ) : ( // Use Link for internal navigation
                  <Link
                    key={item.name}
                    to={item.to}
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                    onClick={() => setMenuOpen(false)} // Close menu after selection
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          )}
        </header>
      )}

      {/* Floating navigation bar, visible when scrolled down */}
      {showFloating && <FloatingNav navItems={floatingNavItems} />}
    </div>
  );
};

export default Navbar;
