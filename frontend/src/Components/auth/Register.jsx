import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Github, ArrowLeft } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Password strength checker — returns score from 0 to 4
  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        className="w-full max-w-md"
      >
  <div className="bg-[var(--card)] backdrop-blur-xl border border-[var(--border)] rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-2 tracking-tight">DevSync</h1>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">Stay ahead. Stay synced. Stay Dev.</p>
            <h2 className="text-2xl font-semibold text-[var(--primary)] mb-2">Create account</h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-[var(--destructive)]/20 border border-[var(--destructive)] text-[var(--destructive)] rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-[var(--primary)]">Full Name</label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--card)] border border-[var(--input)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--card-foreground)]"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[var(--primary)]">Email</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--card)] border border-[var(--input)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--card-foreground)]"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[var(--primary)]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[var(--card)] border border-[var(--input)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--card-foreground)]"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator — initially hidden if password empty */}
              {formData.password && (
                <div className="mt-1">
                  <div className="h-2 w-full rounded bg-[var(--muted)]">
                    <div
                      className={`h-2 rounded ${
                        passwordStrength === 0 ? "w-1/4 bg-red-500" :
                        passwordStrength === 1 ? "w-1/4 bg-red-500" :
                        passwordStrength === 2 ? "w-2/4 bg-yellow-400" :
                        passwordStrength === 3 ? "w-3/4 bg-blue-500" :
                        "w-full bg-green-500"
                      } transition-all duration-300`}
                    />
                  </div>
                  <p className="text-sm mt-1 font-medium text-[var(--primary)]">
                    {["Too weak", "Weak", "Fair", "Good", "Strong"][passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-[var(--primary)]">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className={`w-full pl-10 pr-10 py-3 bg-[var(--card)] border ${passwordMatch ? "border-[var(--input)]" : "border-red-500"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--card-foreground)]`}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!passwordMatch && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !passwordMatch}
              className="w-full py-3 px-4 mt-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-lg hover:bg-[var(--accent)] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center py-3 border border-[var(--input)] rounded-lg text-[var(--primary)] hover:bg-[var(--accent)]">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </button>
              <button onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
              }}
                type="button"
                className="flex items-center justify-center py-3 border border-[var(--input)] rounded-lg text-[var(--primary)] hover:bg-[var(--accent)]">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <span className="text-[var(--muted-foreground)]">Already have an account? </span>
              <Link to="/login" className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
