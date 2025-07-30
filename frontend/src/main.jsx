// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import NotFound from './Components/ui/NotFound.jsx'; // ✅ 404 page

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<NotFound />} /> {/* ✅ Catch-all route */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
