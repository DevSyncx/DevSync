// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { TimerProvider } from "./context/TimerContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";
import About from "./Components/About";
import Contact from "./Components/contact";
import AdStrip from "./Components/Ad";
import { FeaturesSection } from "./Components/Features";
import Footer from "./Components/footer";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper";
import Loader from "./Components/ui/Loader"; // ✅ Import the Loader
import ContributorsSection from "./Components/Contributors";
import AllContributors from "./Components/AllContributors";
import FeedbackController from "./Components/feedback/FeedbackController";
import GuestFeedbackController from "./Components/feedback/GuestFeedbackController";
import FeedbackReviewPage from "./Components/feedback/FeedbackReviewPage";

import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Profile from "./Components/profile/Profile";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Dashboard from "./Components/Dashboard";
import Pomodoro from "./Components/DashBoard/Pomodoro";
import { ArrowUp } from "lucide-react"; 

function Home() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (

  <div className="min-h-screen w-full bg-[var(--background)] scroll-smooth overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
  <main className="relative z-10 px-4 py-24 text-[var(--foreground)]">
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
        <ContributorsSection/>
        <Footer />
      </main>

      {/* ✅ Back to Top Button */}
  
{showTop && (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)]"

  >
    <ArrowUp size={20} />
  </button>
)}

      {showTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)]">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initial loading effect and user data fetch (combined to avoid hooks order issues)
  useEffect(() => {
    // Simulate initial app/data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // adjust delay if needed

    // Check for GitHub login params
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      console.log("Found GitHub token in URL parameters");
      // Store the token for future API calls
      localStorage.setItem("github_token", urlToken);
      sessionStorage.setItem("github_token", urlToken);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Also fetch user data when component mounts
    const fetchUser = async () => {
      try {
        // Try JWT token first
        const token = localStorage.getItem("token");
        // Then check for GitHub token
        const githubToken = localStorage.getItem("github_token") || sessionStorage.getItem("github_token");
        
        if (!token && !githubToken) return;
        
        const headers = {};
        if (token) {
          headers["x-auth-token"] = token;
        }
        if (githubToken) {
          headers["Authorization"] = `Bearer ${githubToken}`;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers,
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log("User data loaded:", userData);
          setUser(userData);
          
          // Log auth method for debugging
          if (token) console.log("Authentication via JWT");
          if (githubToken) console.log("Authentication via GitHub token");
          if (!token && !githubToken) console.log("Authentication via session only");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUser();
    
    return () => clearTimeout(timer);
  }, []);
  
  // Render loading state if app is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader size="lg" />
      </div>
    );
  }
  
  // Main app render when loaded
  return (
    <TimerProvider>
      <FeedbackProvider>
        {/* Feedback Controller - renders appropriate controller based on auth status */}
        {user ? <FeedbackController user={user} /> : <GuestFeedbackController />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />
          <Route path='/contributors' element={<AllContributors/>}/>
          <Route path="/feedback" element={<FeedbackReviewPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </FeedbackProvider>
    </TimerProvider>
  );
}

export default App;