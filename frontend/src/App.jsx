// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar/Navbar'; // Assuming Navbar is a named export
import Footer from './Components/footer'; // Assuming Footer is a default export
import Loader from './Components/ui/Loader'; // Assuming Loader is a default export
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ContactPage from './Pages/ContactPage';
import AdPage from './Pages/AdPage';
import FeaturesPage from './Pages/FeaturesPage'; // Import the new FeaturesPage
import NotFound from './Components/ui/NotFound';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/ad" element={<AdPage />} />
            <Route path="/features" element={<FeaturesPage />} /> {/* Route for Features page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
