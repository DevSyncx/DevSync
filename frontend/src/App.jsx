// src/App.jsx
import React, { useState } from "react";
import Hero from "./Components/Hero.jsx"; // Added .jsx extension
import Navbar from "./Components/Navbar/Navbar.jsx"; // Added .jsx extension
import About from "./Components/About.jsx"; // Added .jsx extension
import AdStrip from "./Components/Ad.jsx"; // Added .jsx extension
import { FeaturesSection } from "./Components/Features.jsx"; // Added .jsx extension
import Footer from "./Components/footer.jsx"; // Added .jsx extension
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper.jsx"; // Added .jsx extension

function App() {
  // State to manage the current active page, initialized to 'home'.
  const [currentPage, setCurrentPage] = useState('home');

  /**
   * Handles changing the current page displayed in the application.
   * Scrolls to the top of the window for a smooth transition.
   * @param {string} page - The identifier of the page to navigate to ('home', 'features', 'about').
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to the top of the window when navigating to a new page.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Renders the component corresponding to the current active page.
   * Wraps components in ScrollRevealWrapper for animation effects.
   * Includes AdStrip only on the home page as per original structure.
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <ScrollRevealWrapper>
              <Hero />
            </ScrollRevealWrapper>
            <ScrollRevealWrapper delay={0.1}>
              <AdStrip />
            </ScrollRevealWrapper>
          </>
        );
      case 'features':
        return (
          <ScrollRevealWrapper delay={0.2}>
            <FeaturesSection />
          </ScrollRevealWrapper>
        );
      case 'about':
        return (
          <About />
        );
      default:
        // Default to home page if an unknown page is requested.
        return (
          <>
            <ScrollRevealWrapper>
              <Hero />
            </ScrollRevealWrapper>
            <ScrollRevealWrapper delay={0.1}>
              <AdStrip />
            </ScrollRevealWrapper>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7] scroll-smooth overflow-hidden">
      {/* Navbar component receives the handlePageChange function as a prop */}
      <Navbar onPageChange={handlePageChange} />

      {/* Main content area where different pages are rendered */}
      <main className="relative z-10 px-4 py-24">
        {renderPage()} {/* Dynamically render the current page */}
        <Footer />
      </main>
    </div>
  );
}

export default App;