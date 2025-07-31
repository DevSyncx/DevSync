import React, { useState } from 'react';
import { z } from 'zod';
import { Send, Cloud } from 'lucide-react'; // Import Send and Cloud icons from Lucide

// Zod schema for form validation
const contactFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  name: z.string().min(1, { message: "Name is required." }),
  message: z.string().min(1, { message: "Message is required." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the field as user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      contactFormSchema.parse(formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Replaced toast.success with alert
      alert('Message sent successfully!');
      setFormData({ email: '', name: '', message: '' }); // Clear form
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        // Replaced toast.error with alert
        alert('Please correct the errors in the form.');
      } else {
        // Replaced toast.error with alert
        alert('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-inter rounded-3xl" style={{ backgroundColor:'rgb(217,228,236)' }}>
      {/* Removed Toaster component */}

      {/* Define keyframes for animations */}
      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes drift {
          0% { transform: translateX(0); opacity: 0.8; }
          50% { transform: translateX(8px); opacity: 0.7; }
          100% { transform: translateX(0); opacity: 0.8; }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float-icon {
          animation: float 3s ease-in-out infinite;
        }

        .animate-drift-1 {
          animation: drift 10s ease-in-out infinite;
        }
        .animate-drift-2 {
          animation: drift 12s ease-in-out infinite reverse;
        }
        .animate-drift-3 {
          animation: drift 8s ease-in-out infinite;
        }
        .animate-drift-4 {
          animation: drift 11s ease-in-out infinite reverse;
        }
        .animate-drift-5 {
          animation: drift 9s ease-in-out infinite;
        }

        .animate-form-entry {
          animation: fadeInScale 0.6s ease-out forwards;
        }
        `}
      </style>

      <div className="relative bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-lg flex flex-col items-center overflow-hidden animate-form-entry">
        {/* Decorative elements: Send icon and clouds */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Send
            className="w-10 h-10 text-blue-500 animate-float-icon"
          />
          <Cloud className="text-blue-200 w-8 h-8 animate-drift-1" style={{ opacity: '0.6', filter: 'blur(0.5px)' }} />
        </div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <Cloud className="text-blue-200 w-6 h-6 animate-drift-2" style={{ opacity: '0.5', filter: 'blur(0.3px)' }} />
          <Cloud className="text-blue-200 w-9 h-9 animate-drift-3" style={{ opacity: '0.7', filter: 'blur(0.7px)' }} />
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Cloud className="text-blue-200 w-7 h-7 animate-drift-4" style={{ opacity: '0.6', filter: 'blur(0.4px)' }} />
        </div>
        <div className="absolute bottom-1/2 right-4 transform translate-y-1/2">
          <Cloud className="text-blue-200 w-11 h-11 animate-drift-5" style={{ opacity: '0.8', filter: 'blur(0.6px)' }} />
        </div>


        {/* Form content */}
        <div className="text-center w-full z-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Get in Touch</h1>
          <p className="text-gray-600 mb-8">
            We'd love to hear from you! Send us a message or reach out directly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                placeholder="Enter your name"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby="name-error"
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 text-left">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                placeholder="We will never share your email with anyone else"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 text-left">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                placeholder="Type your message here..."
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby="message-error"
              ></textarea>
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600 text-left">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-6">
            Alternatively, email us at <a href="mailto:info@example.com" className="text-blue-600 hover:underline">info@example.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;