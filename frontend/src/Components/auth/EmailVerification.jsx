import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const EmailVerification = ({ userId, email, onVerificationSuccess }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Auto-focus first input
  useEffect(() => {
    const firstInput = document.getElementById('verification-input');
    if (firstInput) firstInput.focus();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 6) {
      setVerificationCode(value);
      setError(''); // Clear error when user types
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          verificationCode
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Invalid verification code');
      }

      // Store token and call success handler
      localStorage.setItem('token', data.token);
      setMessage(data.message);
      
      // Small delay to show success message
      setTimeout(() => {
        onVerificationSuccess(data.user);
      }, 1500);

    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Failed to resend code');
      }

      setMessage('New verification code sent to your email!');
      setTimeLeft(900); // Reset timer
      setVerificationCode(''); // Clear current code

    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#A4C7E6] flex items-center justify-center p-4 relative">
      {/* Back to Home */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-[#1D3557] hover:text-[#1D3557]/80 transition duration-200 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-card backdrop-blur-xl border border-border rounded-3xl shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#457B9D] rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1D3557] mb-2">
            Verify Your Email
          </h1>
          <p className="text-[#1D3557]/80 text-sm">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-[#1D3557] mt-1">{email}</p>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[#1D3557]/70 text-sm">
            <Clock className="h-4 w-4" />
            <span>Code expires in {formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Success Message */}
        {message && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {message}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label 
              htmlFor="verification-input" 
              className="block text-sm font-medium text-[#1D3557] mb-3 text-center"
            >
              Enter verification code
            </label>
            <input
              id="verification-input"
              type="text"
              value={verificationCode}
              onChange={handleInputChange}
              placeholder="000000"
              maxLength={6}
              className="w-full text-center text-2xl font-mono tracking-widest py-4 px-4 bg-white/70 border border-[#C5D7E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D] placeholder-[#1D3557]/30"
              autoComplete="off"
            />
            <p className="text-xs text-[#1D3557]/60 text-center mt-2">
              Enter the 6-digit code from your email
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full py-3 px-4 bg-[#457B9D] text-white font-medium rounded-lg hover:bg-[#2E5E82] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#1D3557]/70 mb-3">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={isResending || timeLeft > 840} // Disable for first 60 seconds
            className="text-[#457B9D] hover:text-[#2E5E82] font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Resend Code
              </>
            )}
          </button>
          {timeLeft > 840 && (
            <p className="text-xs text-[#1D3557]/50 mt-1">
              Please wait {Math.ceil((timeLeft - 840) / 60)} minute(s) before requesting a new code
            </p>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-xs text-[#1D3557]/60">
          <p>Check your spam folder if you don't see the email.</p>
          <p className="mt-1">Need help? <Link to="/contact" className="text-[#457B9D] hover:underline">Contact support</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;