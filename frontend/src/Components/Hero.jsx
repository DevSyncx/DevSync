import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="w-full min-h-[80vh] bg-[#A4C7E6] px-6 flex justify-center items-center backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl">
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
    className="w-full max-w-4xl p-10 text-center"
  >
    <h1 className="text-5xl md:text-6xl font-bold text-[#1D3557]">
      Welcome to <span className="text-[#457B9D]">DevSync</span>
    </h1>
    <p className="mt-6 text-xl text-[#1D3557]/80">
      Your all-in-one productivity dashboard for developers 🚀
    </p>
  </motion.div>
</section>

  );
};

export default Hero;
