import React from "react";
import { Button } from "@/Components/ui/button"; // shadcn button
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // if using React Router

const NotFound = () => {
  const navigate = useNavigate();

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

      <Button onClick={() => navigate("/")} className="text-base">
        Go Back Home
      </Button>
    </motion.div>
  );
};

export default NotFound;