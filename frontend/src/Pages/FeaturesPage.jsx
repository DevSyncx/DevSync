// frontend/src/Pages/FeaturesPage.jsx
import React from 'react';
import Features from '../Components/Features'; // Import the existing Features component

const FeaturesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* The Features section, now on its own dedicated page */}
      <Features />
    </div>
  );
};

export default FeaturesPage;
