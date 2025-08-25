import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { HashRouter, Routes, Route } from 'react-router-dom'; // ✅ HashRouter for no 404
import App from './App.jsx';
import NotFound from './Components/ui/NotFound.jsx';
import Register from './Components/auth/Register';
import Profile from './Components/profile/Profile';
import Login from './Components/auth/Login';
import PomodoroTimer from './Components/PomodoroTimer.jsx'; // ✅ Import Pomodoro

// Layout wrapper to keep Navbar/Footer (used in App.jsx)
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/footer';

function PageLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7]">
      <Navbar />
      <main className="relative z-10 px-4 py-24">{children}</main>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        {/* Landing page is App */}
        <Route path="/" element={<App />} />

        {/* Auth routes (already contributed) */}
        <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
        <Route path="/register" element={<PageLayout><Register /></PageLayout>} />
        <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />

        {/* ✅ New Pomodoro route */}
        <Route path="/pomodoro" element={<PageLayout><PomodoroTimer /></PageLayout>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
