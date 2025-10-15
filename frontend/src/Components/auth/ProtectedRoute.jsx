import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../ui/Loader";

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated'

  useEffect(() => {
    // First check local storage for JWT token
    const hasToken = localStorage.getItem("token") !== null;
    
    if (hasToken) {
      setAuthStatus('authenticated');
      return;
    }
    
    // If no token, check for session authentication
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      credentials: 'include' // Important for sending cookies
    })
      .then(res => {
        if (res.ok) {
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
        }
      })
      .catch(() => {
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
