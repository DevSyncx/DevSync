import React, { useEffect, useState } from "react";
import { Github, Home, Info, Sparkle } from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar"; // Ensure this import path is correct for .jsx or .tsx

// Define navigation items.
// 'page' property is used for internal, state-based navigation.
// 'link' property is used for external URLs.
const navItems = [
  {
    name: "Home",
    page: "home", // Internal page identifier for App.jsx state
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: "Features",
    page: "features", // Internal page identifier
    icon: <Sparkle className="h-4 w-4" />,
  },
  {
    name: "About us",
    page: "about", // Internal page identifier
    icon: <Info className="h-4 w-4" />,
  },
  {
    name: "Github",
    link: "https://github.com/DevSyncx/DevSync.git", // External link
    icon: <Github className="h-4 w-4" />,
  },
];

/**
 * Navbar component responsible for site navigation.
 * It renders a fixed header and a floating navigation bar based on scroll position.
 * @param {object} props - Component props.
 * @param {function} props.onPageChange - Callback function to change the current page in App.jsx.
 */
const Navbar = ({ onPageChange }) => {
  const [showFloating, setShowFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Keep the menuOpen state from main branch

  // Effect to control the visibility of the floating navigation bar based on scroll.
  useEffect(() => {
    const handleScroll = () => {
      // Show floating nav if scrolled more than 100px from the top.
      setShowFloating(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup the event listener on component unmount.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle internal navigation clicks
  const handleInternalNavigation = (page) => {
    onPageChange(page); // Update App.jsx's state
    setMenuOpen(false); // Close mobile menu on navigation

    // Update the URL without reloading the page
    // For 'home', the path is '/', otherwise it's '/pageName'
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', path);
  };

  // Prepare navigation items specifically for the FloatingNav component.
  // FloatingNav expects a 'link' property for its items, but we've modified it
  // to also accept an 'onClick' handler for internal navigation.
  const floatingNavItems = navItems.map(item => {
    if (item.link) {
      // If it's an external link, pass it as is.
      return item;
    } else {
      // For internal pages, create an item with an onClick handler.
      // The 'link' property can be omitted or set to '#' in FloatingNav if needed,
      // but the onClick will take precedence due to our FloatingNav logic.
      return {
        ...item,
        onClick: () => handleInternalNavigation(item.page) // Use the new handler
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
                // Render either an anchor tag for external links
                // or a button for internal page changes.
                item.link ? (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank" // Open external links in a new tab
                    rel="noopener noreferrer" // Security best practice
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleInternalNavigation(item.page)} // Use the new handler
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200 bg-transparent border-none cursor-pointer"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                )
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#2E3A59] font-semibold text-base"
              >
                {menuOpen ? "Close" : "Menu"} {/* Toggle text based on state */}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu (Conditional Rendering) */}
          {menuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-3 px-4 pb-4">
              {navItems.map((item) => (
                item.link ? (
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
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleInternalNavigation(item.page)} // Use the new handler
                    className="flex items-center gap-2 text-[17px] font-medium text-[#2E3A59] hover:text-[#6366f1] transition duration-200 bg-transparent border-none cursor-pointer"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                )
              ))}
            </div>
          )}
        </header>
      )}

      {/* Floating navigation bar, visible when scrolled down */}
      {/* It receives the specially prepared floatingNavItems */}
      {showFloating && <FloatingNav navItems={floatingNavItems} />}
    </div>
  );
};

export default Navbar;
