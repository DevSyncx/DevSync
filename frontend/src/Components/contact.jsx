import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Clock,
  Headphones,
  User,
} from "lucide-react";
import contactFormSchema from "@/lib/schemas/contactFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const [status, setStatus] = useState(null);

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    setError,
  } = useForm({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (values) => {
    const { name, email, message } = values;
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        reset();
        setStatus("success");
      } else {
        setStatus("error");
        setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setStatus("error");
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-inter bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4">
            <Mail className="w-10 h-10 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
              <p className="text-gray-600">info@example.com</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4">
            <Clock className="w-10 h-10 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Response Time
              </h3>
              <p className="text-gray-600">Within 24 hours</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4">
            <Headphones className="w-10 h-10 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                24x7 Online Support
              </h3>
              <p className="text-gray-600">Always here to help you</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full z-10"
        >
          <div className="flex items-center justify-center mb-6 space-x-2">
            <MessageCircle className="w-10 h-10 text-blue-600 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
          </div>

          <div className="text-center w-full z-10">
            <AnimatePresence mode="wait">
              {!status && (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <p className="text-gray-600 mb-4">
                    We'd love to hear from you! Send us a message below.
                  </p>

                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="Your Name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 text-left">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 text-left">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="message"
                      {...register("message")}
                      rows="5"
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-blue-500 focus:border-blue-500 transition`}
                      placeholder="Type your message..."
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 text-left">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Send Message
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-600 text-center">
                    Alternatively, email us at{" "}
                    <a
                      href="mailto:info@example.com"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      info@example.com
                    </a>
                  </p>
                </motion.form>
              )}

              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-16 space-y-4"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Message Sent!
                  </h2>
                  <p className="text-gray-600 max-w-sm">
                    We’ve received your message and our team will get back to
                    you shortly. Thank you for reaching out 🙌
                  </p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-16 space-y-4"
                >
                  <AlertTriangle className="w-16 h-16 text-red-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Something went wrong
                  </h2>
                  <p className="text-gray-600 max-w-sm">
                    We couldn’t send your message right now. Please try again
                    later or email us at{" "}
                    <a
                      href="mailto:info@example.com"
                      className="text-blue-600 hover:underline"
                    >
                      info@example.com
                    </a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
