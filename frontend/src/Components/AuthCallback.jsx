import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './ui/Loader.tsx';
import config from '../config';

// This component handles the OAuth callback
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The token is added to the URL by the backend during OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          console.log('Received token in callback');
          // Store the token in localStorage
          localStorage.setItem('auth_token', token);
          
          // Verify the token by calling the backend API
          try {
            const response = await fetch(`${config.apiUrl}/auth/verify`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log('User authenticated:', data.user);
              // Redirect to home or dashboard
              navigate('/');
            } else {
              console.error('Token verification failed');
              setError('Authentication failed. Please try again.');
              setTimeout(() => navigate('/login'), 3000);
            }
          } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            setError('Authentication error. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
          }
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
        {error ? (
          <>
            <div className="text-red-500 mb-4">{error}</div>
            <p className="text-[#1D3557]/70">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <Loader />
            <h2 className="mt-4 text-xl font-medium text-[#1D3557]">Authenticating...</h2>
            <p className="text-[#1D3557]/70 mt-2">Please wait while we complete your sign-in.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;