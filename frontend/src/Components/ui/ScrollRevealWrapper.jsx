// src/components/ScrollRevealWrapper.jsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function ScrollRevealWrapper({
  children,
  delay = 0,
  className = "",
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
