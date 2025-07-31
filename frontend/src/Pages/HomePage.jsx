// frontend/src/Pages/HomePage.jsx
import React from 'react';
import Hero from '../Components/Hero';
// Features component is removed from here as it now has its own page

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* The Hero section for the main landing page */}
      <Hero />
      {/* Features component is no longer rendered directly here */}
    </div>
  );
};

export default HomePage;
