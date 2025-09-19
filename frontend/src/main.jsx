// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NotFound from "./Components/ui/NotFound.jsx";
import Register from "./Components/auth/Register";
import Profile from "./Components/profile/Profile";
import Login from "./Components/auth/Login";
import Dashboard from "./Components/Dashboard";
import TestDashboardPage from "./Components/DashBoard/Test";
import { ThemeProvider } from "./Components/ui/theme-provider";
import PomodoroTimer from "./Components/DashBoard/PomodoroTimer.jsx"; 
import { TimerProvider } from "./context/TimerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <TimerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test" element={<TestDashboardPage />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TimerProvider>
    </ThemeProvider>
  </StrictMode>
);