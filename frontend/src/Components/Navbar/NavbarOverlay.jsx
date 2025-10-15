// src/Components/Navbar/MobileNavOverlay.jsx

import React from "react";
import { Link } from "react-router-dom";
import { X, UserCircle, Clock } from "lucide-react";
import DarkModeToggle from "../ui/DarkModeToggle";

const MobileNavOverlay = ({
  isOpen,
  onClose,
  navItems,
  isAuthenticated,
  handleLogout,
}) => {
  // Use a template literal to conditionally apply the 'open' class
  const overlayClasses = `mobile-nav-overlay ${isOpen ? "open" : ""}`;

  return (
    <div className={overlayClasses}>
      <button onClick={onClose} className="close-btn">
        <X size={32} />
      </button>

      {/* Main Navigation Links */}
      <nav>
        <ul>
          {!isAuthenticated &&
            navItems.map((item) => (
              <li key={item.name}>
                <a href={item.link} onClick={onClose}>
                  {item.name}
                </a>
              </li>
            ))}

          {isAuthenticated && (
            <>
              <li>
                <Link to="/profile" onClick={onClose}>
                  Profile
                </Link>
              </li>
              {/* Add other authenticated links here if needed */}
            </>
          )}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="mobile-nav-footer">
        {!isAuthenticated ? (
          <>
            <Link to="/register" className="w-full">
              <button onClick={onClose} className="signup-btn-mobile">
                Sign Up
              </button>
            </Link>
            <DarkModeToggle />
          </>
        ) : (
          <>
            <button onClick={handleLogout} className="logout-btn-mobile">
              Logout
            </button>
            <DarkModeToggle />
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavOverlay;