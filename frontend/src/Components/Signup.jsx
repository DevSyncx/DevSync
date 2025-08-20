import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Check if passwords match when either password field changes
    if (name === "password" || name === "confirmPassword") {
      if (name === "confirmPassword" && value !== formData.password) {
        setPasswordMatch(false);
      } else if (name === "password" && value !== formData.confirmPassword && formData.confirmPassword) {
        setPasswordMatch(false);
      } else {
        setPasswordMatch(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the backend API for registration
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Registration failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to profile page
      navigate('/profile');
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[80vh] px-6 py-12 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-[#A4C7E6] backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1D3557]">
            Join <span className="text-[#457B9D]">DevSync</span>
          </h1>
          <p className="mt-2 text-lg text-[#1D3557]/80">Create your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1D3557] mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-[#C5D7E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1D3557] mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-[#C5D7E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1D3557] mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-[#C5D7E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
              placeholder="Create a password"
            />
          </div>

 feature-fixed-google-auth
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="border-border text-[#1D3557] hover:bg-accent">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button onClick={() => window.location.href = "http://localhost:5000/auth/google"}
 variant="outline" size="lg" className="border-border text-[#1D3557] hover:bg-accent">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1D3557] mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/70 border ${
                passwordMatch ? "border-[#C5D7E5]" : "border-red-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]`}
              placeholder="Confirm your password"
            />
            {!passwordMatch && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
 main

          <button
            type="submit"
            disabled={isLoading || !passwordMatch}
            className="w-full py-3 px-4 mt-2 bg-[#457B9D] text-white font-medium rounded-lg hover:bg-[#2E5E82] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center text-sm text-[#1D3557]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#457B9D] font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default Signup;
