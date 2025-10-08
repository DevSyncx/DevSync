import React from "react";
import { Button } from "@/Components/ui/button"; // shadcn button
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // if using React Router

const NotFound = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("token");

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/dashboard"); // authenticated users go to dashboard
    } else {
      navigate("/"); // unauthenticated users go to landing page
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#E4ECF1] text-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Button onClick={handleRedirect} className="text-base">
        Go Back Home
      </Button>
    </motion.div>
  );
};

export default NotFound;
