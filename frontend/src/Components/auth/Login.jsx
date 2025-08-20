import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Invalid credentials');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to profile page
      navigate('/profile');
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
      console.error("Login error:", err);
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
            Welcome to <span className="text-[#457B9D]">DevSync</span>
          </h1>
          <p className="mt-2 text-lg text-[#1D3557]/80">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-[#1D3557]">
                Password
              </label>
              <a href="#" className="text-sm text-[#457B9D] hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-[#C5D7E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#457B9D] text-white font-medium rounded-lg hover:bg-[#2E5E82] transition duration-300 flex justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center text-sm text-[#1D3557]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#457B9D] font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default Login;
