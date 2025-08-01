import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination,Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { motion } from 'framer-motion';

const heroSlides = [
  {
    title: 'Welcome to DevSync',
    subtitle: 'Your all-in-one productivity dashboard for developers 🚀',
    bg: '#A4C7E6',
  },
  {
    title: 'Collaborate Effortlessly',
    subtitle: 'Real-time tools for teams to build, track, and ship faster.',
    bg: '#F9C74F',
  },
  {
    title: 'Built for Developers',
    subtitle: 'Customizable widgets, theme support & integrations.',
    bg: '#90BE6D',
  },
];


const Hero = () => {
  return (


    <section className="w-full">



      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
         navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <section
              className={`w-full min-h-[80vh] px-6 py-16 flex justify-center items-center backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl`}
              style={{ backgroundColor: slide.bg }}
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
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>

  );
};

export default Hero;


