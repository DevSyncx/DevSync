// src/Components/AdStrip.jsx
import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";
import { Button } from "./ui/button";
import { PointerHighlight } from "./ui/pointer-highlight";

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
          <RocketIcon className="w-8 h-8 text-blue-950" />
          <span className="uppercase text-sm tracking-wide text-blue-900">
            Built for Developers
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-bold leading-snug text-slate-900">
          <AnimatedWords text="Supercharge your dev flow with DevSync 🚀" />
        </h2>

        {/* Paragraph - FIXED: Changed from <p> to <div> */}
        <div className="text-xl text-slate-700">
          <AnimatedWords text="All your productivity tools. One powerful dashboard. No context switching." />
        </div>

        {/* CTA Button */}
        <PointerHighlight>
          <Button className="text-white bg-cyan-500 hover:bg-cyan-600 px-6 py-3 text-base rounded-xl shadow-lg transition">
            Sign Up
          </Button>
        </PointerHighlight>
      </div>
    </motion.section>
  );
};

export default AdStrip;
