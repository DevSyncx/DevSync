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
import { ThemeProvider } from "./Components/ui/theme-provider";
import PomodoroTimer from "./Components/DashBoard/PomodoroTimer.jsx"; 
import { TimerProvider } from "./context/TimerContext.jsx";
import AllContributors from './Components/AllContributors';
import LeetCode from "./Components/DashBoard/LeetCode";

createRoot(document.getElementById('root')).render(
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
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path='/contributors' element={<AllContributors/>}/>
            <Route path="/leetcode/:leetUser" element={<LeetCode />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TimerProvider>
    </ThemeProvider>
  </StrictMode>
);