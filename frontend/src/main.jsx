// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NotFound from "./Components/ui/NotFound.jsx";
import { ThemeProvider } from "./Components/ui/theme-provider";
import PomodoroTimer from "./Components/DashBoard/PomodoroTimer.jsx";
import { TimerProvider } from "./context/TimerContext.jsx";
import { FeedbackProvider } from "./context/FeedbackContext.jsx";
import AllContributors from './Components/AllContributors';
import LeetCode from "./Components/DashBoard/LeetCode";
import logo from './assets/DevSync.svg';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <TimerProvider>
        <FeedbackProvider>
          <BrowserRouter>
            <Routes>
              {/* App handles all routes internally */}
              <Route path="/*" element={<App />} />
              
              {/* Extra routes outside of App */}
              <Route path="/pomodoro" element={<PomodoroTimer />} />
              <Route path="/contributors" element={<AllContributors />} />
              <Route path="/leetcode/:leetUser" element={<LeetCode />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FeedbackProvider>
      </TimerProvider>
    </ThemeProvider>
  </StrictMode>
);

const favicon = document.getElementById("favicon");
if (favicon) favicon.href = logo;