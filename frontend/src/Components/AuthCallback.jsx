import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './ui/Loader.tsx';

// This component handles the OAuth callback
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The token is added to the URL by the backend during OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          // Store the token in localStorage
          localStorage.setItem('auth_token', token);
          
          // Redirect to home or dashboard
          navigate('/');
        } else {
          // If no token is present, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };
    
    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#A4C7E6]">
      <div className="text-center p-8 rounded-xl bg-white/90 shadow-lg">
        <Loader />
        <h2 className="mt-4 text-xl font-medium text-[#1D3557]">Authenticating...</h2>
        <p className="text-[#1D3557]/70 mt-2">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;