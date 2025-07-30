// src/App.jsx
import React, { useEffect, useState } from "react";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";
import About from "./Components/About";
import AdStrip from "./Components/Ad";
import { FeaturesSection } from "./Components/Features";
import Footer from "./Components/footer";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper";
import Loader from "./Components/ui/Loader"; // ✅ Import the Loader

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app/data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // adjust delay if needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E4ECF1]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7] scroll-smooth overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 px-4 py-24">
        <ScrollRevealWrapper>
          <div id="home">
            <Hero />
          </div>
        </ScrollRevealWrapper>

        <ScrollRevealWrapper delay={0.1}>
          <AdStrip />
        </ScrollRevealWrapper>

        <ScrollRevealWrapper delay={0.2}>
          <div id="features">
            <FeaturesSection />
          </div>
        </ScrollRevealWrapper>

        <div id="about">
          <About />
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default App;
