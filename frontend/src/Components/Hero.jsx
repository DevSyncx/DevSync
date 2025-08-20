import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { motion } from 'framer-motion';

const heroSlides = [
  {
    title: "Welcome to DevSync",
    subtitle: "Your all-in-one productivity dashboard for developers 🚀",
    bg: "#A4C7E6",
    image: "https://www.sectorlink.com/img/blog/web-devel-important.jpg",
  },
  {
    title: "Collaborate Effortlessly",
    subtitle: "Real-time tools for teams to build, track, and ship faster.",
    bg: "#F9C74F",
    image: "https://www.sectorlink.com/img/blog/web-devel-important.jpg",
  },
  {
    title: "Built for Developers",
    subtitle: "Customizable widgets, theme support & integrations.",
    bg: "#90BE6D",
    image: "https://www.sectorlink.com/img/blog/web-devel-important.jpg",
  },
];

const Component1 = () => (
  <section className="w-full min-h-[80vh] bg-slate-800 rounded-md">
    <div className="flex flex-col sm:flex-row mx-auto gap-0 sm:gap-10 justify-center sm:justify-around  items-center p-10 text-white ">
      <div className="my-10 sm:mx-12 flex flex-col ">
        <h2 className="font-bold text-3xl sm:text-5xl my-3 sm:my-10 font-mono capitalize">
          Welcome to DevSync
          <span className="inline-block w-5 h-5 mx-0 sm:mx-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_13px_#ef4444]"></span>
        </h2>
        <p className="text-xl sm:text-2xl font-mono">
          Your all-in-one productivity dashboard for developers 🚀
        </p>

        <button className="relative  bg-green-400 w-fit p-3 text-xl font-bold text-black rounded-lg hover:scale-105 transition-all duration-150 cursor-pointer my-3 sm:my-10 overflow-hidden group">
          Get Started
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
        </button>
      </div>
      <div>
        {/* <img
          className="w-2xl sm:w-3xl"
          src="https://media.gettyimages.com/id/1640065952/vector/web-development-illustration.jpg?s=612x612&w=gi&k=20&c=Q7YK6n6Tj_MdrAayu9G113K-TnAYv_QlavLbqJgJe0s="
        ></img> */}
         <img
          className="w-2xl sm:w-3xl"
          src="/heroImg2.jpg"
        ></img>

      </div>
    </div>
  </section>
);

// const Component2 = () => (
//   <section className="w-full min-h-[80vh] bg-[url(/heroImg3.jpg)] bg-cover bg-center rounded-md p-12 sm:py-10 ">
//     <div className="flex flex-col sm:flex-row mx-auto gap-0 sm:gap-10 justify-end sm:justify-around  items-baseline p-3 sm:p-5 text-black border-2 w-fit  bg-white/10 backdrop-blur-sm">
//       <div className="my-10 sm:mx-12 flex flex-col  ">
//         <h2 className="font-bold text-3xl sm:text-5xl my-3 sm:my-10 font-mono capitalize">
//           Collaborate Effortlessly
//         </h2>
//         <p className="text-xl font-bold sm:text-2xl font-mono">
//           Real-time tools for teams to build, track, and ship faster.{" "}
//         </p>

//         <button className="relative block mx-auto bg-cyan-500 w-fit p-3 text-xl font-bold text-black rounded-lg hover:scale-105 transition-all duration-150 cursor-pointer my-3 sm:my-10 overflow-hidden group">
//           Learn More
//           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
//         </button>
//       </div>
//       {/* <div>
//         <img className="w-2xl sm:w-2xl" src="/heroImg2.jpg"></img> 
//       </div> */}
//     </div>
//   </section>
// );

const Component2 = () => (
  <section className="w-full min-h-[80vh] bg-slate-800 rounded-md">
    <div className="flex flex-col-reverse sm:flex-row mx-auto gap-0 sm:gap-10 justify-center sm:justify-around  items-center p-10 text-white ">
      <div>
        <img
          className="w-2xl sm:w-3xl border border-amber-500"
          src="/heroImg7.jpg"
        ></img>
      </div>
      <div className="my-10 sm:mx-12 flex flex-col ">
        <h2 className="font-bold text-3xl sm:text-5xl my-3 sm:my-10 font-mono capitalize">
          Collaborate Effortlessly
          
        </h2>
        <p className="text-xl sm:text-2xl font-mono">
          Real-time tools for teams to build, track, and ship faster.
        </p>

        <button className="relative bg-red-600  w-fit p-3 text-xl font-bold  rounded-lg hover:scale-105 transition-all duration-150 cursor-pointer my-5 sm:my-10 overflow-hidden group text-white">
          Learn More
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
          
        </button>
        
      </div>
      
    </div>
  </section>
);




const Component3 = () => (
  <section className="w-full min-h-[80vh] bg-slate-800 rounded-md">
    <div className="flex flex-col sm:flex-row mx-auto gap-0 sm:gap-10 justify-center sm:justify-around  items-center p-10 text-white ">
      
      <div className="my-10 sm:mx-12 flex flex-col ">
        <h2 className="font-bold text-3xl sm:text-5xl my-3 sm:my-10 font-mono capitalize">
          Built for Developers
          
        </h2>
        <p className="text-xl sm:text-2xl font-mono">
          Customizable widgets, theme support & integrations.
        </p>

        <button className="relative bg-purple-700  w-fit p-3 text-xl font-bold  rounded-lg hover:scale-105 transition-all duration-150 cursor-pointer my-5 sm:my-10 overflow-hidden group text-white">
          Learn More
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
          
        </button>
        
      </div>
      <div>
        <img
          className="w-2xl sm:w-3xl "
          src="/heroImg4.jpg"
        ></img>
      </div>
      
    </div>
  </section>
);

const slides = [<Component1 />, <Component2 />, <Component3 />];

const Hero = () => {
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* <section
              className={`w-full min-h-[80vh] px-6 py-16 flex justify-center items-center backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl`}
              
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="w-full max-w-4xl p-10 text-center"
              >
               
                <h1 className="text-5xl md:text-6xl font-bold text-[#1D3557]">
                  {slide.title}
                </h1>
                
                
                <p className="mt-6 text-xl text-[#1D3557]/80">{slide.subtitle}</p>
                
                 
              </motion.div>
            </section> */}
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
