// frontend/src/Components/Navbar/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils'; // Assuming this utility is still needed

export const Navbar = ({ className }) => {
  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Features', link: '/features' }, // Link to the new Features page
    { name: 'Contact', link: '/contact' },
    { name: 'Ad', link: '/ad' },
  ];

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex justify-center items-center py-4 bg-black/80 backdrop-blur-md shadow-lg',
        className
      )}
    >
      <div className="flex space-x-8">
        {navItems.map((item, idx) => (
          <Link
            key={`link-${idx}`}
            to={item.link}
            className="relative items-center flex space-x-1 text-neutral-300 hover:text-white transition-colors duration-200"
          >
            <span className="block sm:hidden">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
