import React from 'react';
import { useNavigate } from 'react-router-dom';

// Simple Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Authentication error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f7fa] p-4">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-700 mb-4">There was an error loading the application.</p>
            <p className="text-gray-500 text-sm mb-4">{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auth Context
export const AuthContext = React.createContext();

// Authentication Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on component mount
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Handle OAuth callback with token
  React.useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        localStorage.setItem('auth_token', token);
        
        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Fetch user data
        fetch('http://localhost:5000/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          setUser(data.user);
          navigate('/');
        })
        .catch(err => {
          console.error('Failed to get user data:', err);
        });
      }
    };
    
    if (window.location.pathname === '/auth-callback') {
      handleAuthCallback();
    }
  }, [navigate]);
  
  // Sign out function
  const signOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    navigate('/login');
  };

  // Auth context value
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </React.Suspense>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};