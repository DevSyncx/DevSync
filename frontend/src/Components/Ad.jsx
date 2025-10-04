// src/Components/AdStrip.jsx
import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";
import { Button } from "./ui/button";
import { PointerHighlight } from "./ui/pointer-highlight";
import { Link } from "react-router-dom";

// Generate random jitter for words
const randomShift = () => ({
  x: Math.random() * 10 - 5,
  y: Math.random() * 10 - 5,
  rotate: Math.random() * 10 - 5,
});

const AnimatedWords = ({ text }) => {
  return (
    <motion.div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={index}
          whileHover={randomShift}
          whileTap={randomShift}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="inline-block cursor-pointer"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const AdStrip = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full py-16 px-6 mt-12"
    >
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center space-y-6">
        
        {/* Top label */}
        <div className="flex items-center gap-3 justify-center">
          <RocketIcon className="w-8 h-8" style={{ color: "var(--primary)" }} />
          <span className="uppercase text-sm tracking-wide" style={{ color: "var(--primary)" }}>
            Built for Developers
          </span>
        </div>

        {/* Heading */}
  <h2 className="text-4xl md:text-6xl font-bold leading-snug" style={{ color: "var(--foreground)" }}>
          <AnimatedWords text="Supercharge your dev flow with DevSync 🚀" />
        </h2>

        {/* Paragraph - FIXED: Changed from <p> to <div> */}
  <div className="text-xl" style={{ color: "var(--muted-foreground)" }}>
        {/* Paragraph */}
        <div className="text-xl text-slate-700">
          <AnimatedWords text="All your productivity tools. One powerful dashboard. No context switching." />
        </div>
        </div>

        {/* CTA Button */}
        <PointerHighlight>
        <Link to="/register">  <Button style={{ background: "var(--primary)", color: "var(--primary-foreground)" }} className="px-6 py-3 text-base rounded-xl shadow-lg transition">
            Sign Up
          </Button>
          </Link>
        </PointerHighlight>
      </div>
    </motion.section>
  );
};

export default AdStrip;
