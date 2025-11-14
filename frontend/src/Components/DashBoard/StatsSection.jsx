import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Users, Star, GitFork, UsersRound } from "lucide-react";

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    stars: 0,
    forks: 0,
    contributors: 0,
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/api/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  const Counter = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
        else setCount(value);
      };

      requestAnimationFrame(animate);
    }, [value]);

    return <span>{count}</span>;
  };

  const data = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users size={30} /> },
    { label: "GitHub Stars", value: stats.stars, icon: <Star size={30} /> },
    { label: "Forks", value: stats.forks, icon: <GitFork size={30} /> },
    { label: "Contributors", value: stats.contributors, icon: <UsersRound size={30} /> },
  ];

  const gradient = "from-blue-500 via-blue-600 to-fuchsia-500";

  const bgGlow = isDark
    ? "bg-[radial-gradient(circle_at_25%_30%,rgba(80,120,255,0.08),transparent_70%),radial-gradient(circle_at_80%_70%,rgba(255,100,255,0.05),transparent_70%)]"
    : "bg-[radial-gradient(circle_at_25%_30%,rgba(80,120,255,0.05),transparent_70%),radial-gradient(circle_at_80%_70%,rgba(255,100,255,0.04),transparent_70%)]";

  const shadowGlow = isDark
    ? "shadow-[0_0_12px_rgba(80,120,255,0.35)]"
    : "shadow-[0_0_10px_rgba(80,120,255,0.25)]";

  const cardVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.9, rotateX: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.25,
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 120, scale: 0.96, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true, amount: 0.2 }}
      className={`relative w-full min-h-[90vh] flex flex-col justify-center items-center 
                  bg-[var(--background)] text-[var(--foreground)] overflow-hidden 
                  rounded-3xl border-2 ${shadowGlow}
                  border-[rgba(80,120,255,0.3)] backdrop-blur-lg`}
    >
      <div className={`absolute inset-0 ${bgGlow} transition-all duration-700`} />

      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`text-5xl md:text-6xl font-extrabold tracking-wide mb-14
                    text-transparent bg-clip-text bg-gradient-to-r ${gradient}
                    bg-[length:200%_200%] animate-[liquidflow_6s_ease_infinite]`}
      >
        Project Insights ⚡
      </motion.h1>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-14 w-[92%] max-w-6xl z-10"
      >
        {data.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            custom={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 180 }}
            className={`flex flex-col justify-center items-center rounded-2xl py-10 px-4
                        border-2 border-[rgba(80,120,255,0.25)] bg-[var(--card)]
                        cursor-pointer
                        hover:shadow-[0_0_25px_rgba(80,120,255,0.4)]
                        transition-all duration-700 group relative backdrop-blur-sm`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient}/10 
                          opacity-0 group-hover:opacity-20 rounded-2xl 
                          transition-opacity duration-700`}
            />
            <motion.div
              className="group-hover:scale-110 transition-transform duration-500 mb-4"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {stat.icon}
            </motion.div>
            <h2
              className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              <Counter value={stat.value} />
            </h2>
            <p className="mt-3 text-sm uppercase tracking-widest font-semibold text-[var(--foreground)]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-48 h-48 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-3xl animate-pulse top-[25%] left-[10%]" />
        <div className="absolute w-48 h-48 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-3xl animate-pulse delay-700 bottom-[15%] right-[15%]" />
      </div>

      <style>{`
        @keyframes liquidflow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.section>
  );
};

export default StatsSection;
