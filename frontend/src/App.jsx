import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";
import About from "./Components/About";
import Contact from "./Components/contact";
import AdStrip from "./Components/Ad";
import { FeaturesSection } from "./Components/Features";
import Footer from "./Components/footer";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper";
import Loader from "./Components/ui/Loader"; // ✅ Import the Loader

import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Profile from "./Components/profile/Profile";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import PomodoroTimer from "./Components/PomodoroTimer";

// Home component that contains the main landing page content
function Home() {
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
        <ScrollRevealWrapper delay={0.2}>
          <div id="contact">
            <Contact />
          </div>
        </ScrollRevealWrapper>

        <Footer />
      </main>
    </div>
  );
}

// ✅ Layout wrapper for other routes
function PageLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7]">
      <Navbar />
      <main className="relative z-10 px-4 py-24">{children}</main>
      <Footer />
    </div>
  );
}

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
    <Routes>
      <Route path="/" element={<Home />} />

      {/* ✅ Wrapped with Navbar + Footer */}
      <Route
        path="/login"
        element={
          <PageLayout>
            <Login />
          </PageLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PageLayout>
            <Register />
          </PageLayout>
        }
      />
      <Route
        path="/pomodoro"
        element={
          <PageLayout>
            <PomodoroTimer />
          </PageLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PageLayout>
              <Profile />
            </PageLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
