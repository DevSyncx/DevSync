// src/components/ScrollRevealWrapper.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollRevealWrapper({
  children,
  delay = 0,
  className = "",
}: ScrollRevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track if element is in view
  const { inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

