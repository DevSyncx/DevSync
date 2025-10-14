import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message });
      } else {
        setStatus({ type: "error", message: data.message || "Something went wrong" });
      }
    } catch {
      setStatus({ type: "error", message: "Server error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-[var(--primary)] mb-4">
          Forgot Password
        </h2>
        <p className="text-sm text-center text-[var(--muted-foreground)] mb-6">
          Enter your registered email and we’ll send you a reset link.
        </p>

        {status && (
          <div
            className={`p-3 mb-4 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-[var(--input)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] bg-[var(--card)] text-[var(--card-foreground)]"
              placeholder="Enter your email"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:bg-[var(--accent)] transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
