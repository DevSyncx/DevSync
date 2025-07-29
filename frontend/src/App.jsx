import { Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";
import About from "./Components/About";
import AdStrip from "./Components/Ad";
import { FeaturesSection } from "./Components/Features";
import Footer from "./Components/footer";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper";
import SignUp from "./pages/SignUp";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "./Components/Loader/Loader";
import NotFound from "./Components/NotFound";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return !isLoading ? (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7] scroll-smooth">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main className="relative z-10 px-4 py-24">
                <ScrollRevealWrapper>
                  <div id="home">
                    <Hero />
                  </div>
                </ScrollRevealWrapper>

                <ScrollRevealWrapper delay={0.1}>
                  <AdStrip />
                </ScrollRevealWrapper>

                <ScrollRevealWrapper delay={0.2}>
                  <div id="features">
                    <FeaturesSection />
                  </div>
                </ScrollRevealWrapper>

                <div id="about">
                  <About />
                </div>

                <Footer />
              </main>
            </>
          }
        />

        <Route path="/login" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  ) : (
    <Loader />
  );
}

export default App;
