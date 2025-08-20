import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const textRef = useRef(null);
  const underlineRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[78vh] px-6 py-20 flex items-center justify-center overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-b from-white to-sky-50 shadow-2xl"
    >
      {/* subtle corner accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-3 top-3 h-10 w-20 rounded-tl-2xl border-l border-t border-sky-200/70" />
        <div className="absolute right-3 top-3 h-10 w-20 rounded-tr-2xl border-r border-t border-sky-200/70" />
        <div className="absolute left-3 bottom-3 h-10 w-20 rounded-bl-2xl border-l border-b border-sky-200/70" />
        <div className="absolute right-3 bottom-3 h-10 w-20 rounded-br-2xl border-r border-b border-sky-200/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-5xl text-center px-2"
      >
        {/* badge */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#215A96] shadow-sm backdrop-blur"
        >
          <span className="size-2 rounded-full bg-blue-500" /> Productivity Platform
        </motion.div>

        {/* Headline */}
        <h1 className="text-balance font-extrabold tracking-tight text-[#071221]">
          <span className="block text-5xl md:text-7xl">Welcome to</span>
          <motion.div 
            ref={textRef}
            className="relative mx-auto mt-2 inline-block"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ 
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            <motion.span 
              className="relative mx-auto inline-block bg-gradient-to-r from-[#1D3557] via-[#215A96] to-[#3B82F6] bg-clip-text text-transparent text-6xl md:text-8xl"
              animate={{ 
                textShadow: isHovering ? "0 0 8px rgba(59, 130, 246, 0.3)" : "0 0 0px rgba(59, 130, 246, 0)",
                transform: isHovering ? 
                  `perspective(1000px) rotateX(${(mousePosition.y - 50) / 50}deg) rotateY(${(mousePosition.x - 130) / 50}deg)` : 
                  "perspective(1000px) rotateX(0deg) rotateY(0deg)"
              }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              DevSync
            </motion.span>
            
            {/* Interactive underline with cursor response */}
            <motion.div 
              ref={underlineRef}
              className="relative mx-auto mt-1 h-[1px] max-w-[260px]"
              style={{ 
                background: "linear-gradient(to right, transparent, #60a5fa, transparent)",
                boxShadow: isHovering ? "0 0 10px 1px rgba(59, 130, 246, 0.5)" : "none",
              }}
              animate={{ 
                width: isHovering ? "100%" : "80%",
                height: isHovering ? "2px" : "1px",
                x: isHovering ? `calc(${mousePosition.x / 5 - 10}px)` : 0
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            />
          </motion.div>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg md:text-2xl text-slate-600">
          Your all-in-one productivity dashboard for developers 🚀
        </p>

        <div className="mt-6" />
      </motion.div>
    </section>

  );
};

export default Hero;
