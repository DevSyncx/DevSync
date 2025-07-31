// frontend/src/Components/footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-950 text-neutral-400 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-white mb-2">DevSync</h3>
          <p className="text-sm">Your all-in-one developer productivity dashboard.</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-white mb-2">Quick Links</h4>
            <a href="/" className="hover:text-white transition-colors duration-200">Home</a>
            <a href="/about" className="hover:text-white transition-colors duration-200">About</a>
            <a href="/features" className="hover:text-white transition-colors duration-200">Features</a>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-white mb-2">Connect</h4>
            <a href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</a>
            <a href="https://github.com/dhanaraj02/DevSync" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">GitHub</a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm border-t border-gray-800 pt-4">
        &copy; {new Date().getFullYear()} DevSync. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; // Ensure this line is present and correct
