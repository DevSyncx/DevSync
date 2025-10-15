// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { TimerProvider } from "./context/TimerContext";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";
import About from "./Components/About";
import Contact from "./Components/contact";
import AdStrip from "./Components/Ad";
import { FeaturesSection } from "./Components/Features";
import Footer from "./Components/footer";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper";
import Loader from "./Components/ui/Loader";
import ContributorsSection from "./Components/Contributors";
import AllContributors from "./Components/AllContributors";

import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Profile from "./Components/profile/Profile";
import ForgotPassword from "./Components/auth/ForgotPassword";
import ResetPassword from "./Components/auth/ResetPassword";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Dashboard from "./Components/Dashboard";
import FAQ from "./Components/FAQ";
import Pomodoro from "./Components/DashBoard/Pomodoro";
import Todo from "./Components/DashBoard/Todo";
import { ArrowUp } from "lucide-react";
import GitHubProfile from "./Components/GitHubProfile";
import LeetCode from "./Components/DashBoard/LeetCode";
import FloatingSupportButton from "./Components/ui/Support";

function Home() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen w-full bg-[var(--background)] scroll-smooth overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 px-4 pt-[108px] pb-24 text-[var(--foreground)]">
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

        <ScrollRevealWrapper delay={0.2}>
          <div id="FAQ">
            <FAQ />
          </div>
        </ScrollRevealWrapper>

        <ContributorsSection />
        <Footer />
        <FloatingSupportButton />
      </main>

      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)]"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <TimerProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />
        <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />
        <Route path="/contributors" element={<AllContributors />} />
        <Route path="/dashboard/github/:username" element={<ProtectedRoute><GitHubProfile /></ProtectedRoute>} />
        <Route path="/leetcode/:leetUser" element={<ProtectedRoute><LeetCode /></ProtectedRoute>} />
      </Routes>
    </TimerProvider>
  );
}

export default App;