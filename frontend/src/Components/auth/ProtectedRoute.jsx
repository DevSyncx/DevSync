import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../ui/Loader";

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated'

  useEffect(() => {
    // Check if we have either a JWT token or a GitHub token
    const hasToken = localStorage.getItem("token") !== null;
    const hasGithubToken = sessionStorage.getItem("github_token") !== null;
    
    if (hasToken || hasGithubToken) {
      console.log("Authentication found:", { jwt: hasToken, github: hasGithubToken });
      setAuthStatus('authenticated');
      return;
    }
    
    console.log("No tokens found, checking for session authentication...");
    
    // If no tokens, check for session authentication
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      credentials: 'include', // Important for sending cookies
      headers: { 
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => {
        if (res.ok) {
          console.log("Session authentication successful");
          setAuthStatus('authenticated');
        } else {
          console.log("Session authentication failed");
          setAuthStatus('unauthenticated');
        }
      })
      .catch((err) => {
        console.error("Authentication check error:", err);
        setAuthStatus('unauthenticated');
      });
  }, []);

  if (authStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <Loader size="lg" />
    </div>;
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
