// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Hero from "./Components/Hero.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import About from "./Components/About.jsx";
import Contact from "./Components/Contact.jsx"; // Ensure this path is correct
import AdStrip from "./Components/Ad.jsx";
import { FeaturesSection } from "./Components/Features.jsx";
import Footer from "./Components/footer.jsx";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper.jsx";
import Loader from "./Components/ui/Loader.tsx"; // Ensure this path is correct for your Loader file

function App() {
  // Keep loading state as it's independent of routing method
  const [loading, setLoading] = useState(true);

  // Effect to simulate initial app/data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // adjust delay if needed

    return () => clearTimeout(timer);
  }, []);

  // Conditional rendering for the loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E4ECF1]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7] scroll-smooth overflow-hidden">
      {/* Navbar component - no longer needs onPageChange prop directly */}
      <Navbar />

      {/* Main content area where different pages are rendered using React Router */}
      <main className="relative z-10 px-4 py-24">
        <Routes>
          <Route path="/" element={
            <>
              <ScrollRevealWrapper><Hero /></ScrollRevealWrapper>
              <ScrollRevealWrapper delay={0.1}><AdStrip /></ScrollRevealWrapper>
            </>
          } />
          <Route path="/features" element={
            <ScrollRevealWrapper delay={0.2}><FeaturesSection /></ScrollRevealWrapper>
          } />
          <Route path="/about" element={
            <About />
          } />
          <Route path="/contact" element={
            <ScrollRevealWrapper delay={0.2}><Contact /></ScrollRevealWrapper>
          } />
          {/* You can add a 404 Not Found page here if desired */}
          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
        </Routes>
        {/* Footer component - no longer needs onPageChange prop directly */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
