import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Github, ArrowLeft } from "lucide-react";
import EmailVerification from "./EmailVerification"; // Import the verification component

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.focus();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid server response");
      }

      if (response.ok) {
        // Check if user needs email verification
        if (data.requiresVerification) {
          setUserId(data.userId);
          setShowVerification(true); // Don't throw error, show verification instead
          return;
        }
      } else {
        throw new Error(data.errors?.[0]?.msg || "Invalid credentials");
      }
      // Successful login
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = (user) => {
    navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  // Show verification component if user needs to verify email
  if (showVerification) {
    return (
      <EmailVerification
        userId={userId}
        email={formData.email}
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 relative">
      {/* Back to Home */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 transition duration-200 bg-[var(--card)]/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-[var(--card)] backdrop-blur-xl border border-[var(--border)] rounded-3xl shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-2 tracking-tight">DevSync</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">Stay ahead. Stay synced. Stay Dev.</p>
          <h2 className="text-2xl font-semibold text-[var(--primary)] mb-2">Welcome back</h2>
          <p className="text-[var(--muted-foreground)]">Sign in to your account to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-[var(--destructive)]/20 border border-[var(--destructive)] text-[var(--destructive)] rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--primary)] mb-1"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-10 bg-[var(--card)] border border-[var(--input)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--card-foreground)]"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--primary)]"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-10 pr-10 bg-[var(--card)] border border-[var(--input)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--card-foreground)]"
                placeholder="Enter your password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-lg hover:bg-[var(--accent)] transition duration-300 flex justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-[var(--primary-foreground)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 
                      0 0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 
                      014 12H0c0 3.042 1.135 
                      5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--card)] px-2 text-[var(--muted-foreground)]">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="border border-[var(--input)] text-[var(--primary)] hover:bg-[var(--accent)] py-3 rounded-lg flex justify-center items-center"
            >
              <Github className="h-4 w-4 mr-2" /> GitHub
            </button>
            <button onClick={handleGoogleLogin}
              type="button"
              className="border border-[var(--input)] text-[var(--primary)] hover:bg-[var(--accent)] py-3 rounded-lg flex justify-center items-center"
            >
              <svg
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                  1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                  3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 
                  7.28-2.66l-3.57-2.77c-.98.66-2.23 
                  1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                  20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                  8.55 1 10.22 1 12s.43 3.45 1.18 
                  4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 
                  4.21 1.64l3.15-3.15C17.45 2.09 
                  14.97 1 12 1 7.7 1 3.99 3.47 
                  2.18 7.07l3.66 2.84c.87-2.6 
                  3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          {/* Signup */}
          <div className="text-center">
            <span className="text-[var(--muted-foreground)]">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;