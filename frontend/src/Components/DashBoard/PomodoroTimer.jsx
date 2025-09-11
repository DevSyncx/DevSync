import { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import ThemeContext from "../ui/theme-provider.jsx";

const SESSIONS_BEFORE_LONG_BREAK = 4;

// Minimal and visible Circular Timer for Minutes and Seconds
function CircularTimer({ value, max, label, size = 160, isDarkMode }) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  // High contrast palette for both themes
  const palette = isDarkMode
    ? {
        track: "#353945",    // Very dark gray
        arc: "#b7beca",      // Light gray
        text: "#fff",
        label: "#cfd8ea"
      }
    : {
        track: "#d0d4da",
        arc: "#475569",      // Slate gray
        text: "#111",
        label: "#7a878e"
      };

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={palette.track}
          strokeWidth="10"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={palette.arc}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s linear" }}
        />
      </svg>
      {/* Centered Value and Label */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none"
        }}
      >
        <span style={{
          fontSize: 32,
          color: palette.text,
          fontWeight: 700,
          fontFamily: "'Roboto Mono', monospace",
          letterSpacing: 2
        }}>
          {String(value).padStart(2, "0")}
        </span>
        <span style={{
          fontSize: 15,
          color: palette.label,
          marginTop: 7,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontFamily: "'Roboto', sans-serif"
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function PomodoroTimer() {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const [workTime, setWorkTime] = useState(25 * 60);
  const [shortBreak, setShortBreak] = useState(5 * 60);
  const [longBreak, setLongBreak] = useState(15 * 60);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setIsWork(true);
    setTimeLeft(workTime);
    setSessions(0);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (isWork) {
        const nextSessionCount = sessions + 1;
        setSessions(nextSessionCount);
        setTimeLeft(
          nextSessionCount % SESSIONS_BEFORE_LONG_BREAK === 0
            ? longBreak
            : shortBreak
        );
      } else {
        setTimeLeft(workTime);
      }
      setIsWork(!isWork);
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(
          isWork
            ? "Work session complete! Time for a break 🎉"
            : "Break over! Back to work 💻"
        );
      }
    }
  }, [timeLeft, isWork, sessions, workTime, shortBreak, longBreak]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleWorkTimeChange = (e) => {
    const value = Math.max(1, Number(e.target.value)) * 60;
    setWorkTime(value);
    if (isWork) setTimeLeft(value);
  };
  const handleShortBreakChange = (e) => {
    const value = Math.max(1, Number(e.target.value)) * 60;
    setShortBreak(value);
    if (!isWork && sessions % SESSIONS_BEFORE_LONG_BREAK !== 0) setTimeLeft(value);
  };
  const handleLongBreakChange = (e) => {
    const value = Math.max(1, Number(e.target.value)) * 60;
    setLongBreak(value);
    if (!isWork && sessions % SESSIONS_BEFORE_LONG_BREAK === 0) setTimeLeft(value);
  };

  const totalTime =
    isWork
      ? workTime
      : sessions % SESSIONS_BEFORE_LONG_BREAK === 0
      ? longBreak
      : shortBreak;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#232b34] text-white"
          : "bg-gradient-to-br from-blue-100 to-white text-black"
      }`}
    >
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-6">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-10">
          {isWork ? "Focus Time 💻" : "Break Time ☕"}
        </h1>
        {/* Circular Timers and Colon */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "54px",
          marginBottom: "36px",
          justifyContent: "center"
        }}>
          <CircularTimer
            value={minutes}
            max={59}
            label="MINUTES"
            size={140}
            isDarkMode={isDarkMode}
          />
          <span
            style={{
              fontSize: "44px",
              fontWeight: "700",
              color: isDarkMode ? "#d5dae0" : "#232b34",
              textShadow: isDarkMode ? "0 0 8px #232b34" : "0 0 5px #dde",
              margin: "0 8px",
              minWidth: "22px",
              letterSpacing: 2,
              opacity: 0.8,
              userSelect: "none"
            }}
          >:</span>
          <CircularTimer
            value={seconds}
            max={59}
            label="SECONDS"
            size={140}
            isDarkMode={isDarkMode}
          />
        </div>
        {/* Duration Inputs */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-xl justify-center p-6 rounded-xl shadow-lg transition-colors duration-500">
          {[
            { label: "Work", value: Math.floor(workTime / 60), onChange: handleWorkTimeChange },
            { label: "Short Break", value: Math.floor(shortBreak / 60), onChange: handleShortBreakChange },
            { label: "Long Break", value: Math.floor(longBreak / 60), onChange: handleLongBreakChange },
          ].map((input) => (
            <div key={input.label} className="flex flex-col items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner w-28 transition-colors duration-300">
              <label className="text-sm mb-2 text-gray-800 dark:text-gray-200 font-medium">{input.label} (min)</label>
              <input
                type="number"
                min="1"
                value={input.value}
                onChange={input.onChange}
                className="w-full text-center px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-black dark:text-white"
              />
            </div>
          ))}
        </div>
        {/* Control Buttons */}
        <div className="flex gap-4 mb-8">
          {!isRunning ? (
            <button onClick={startTimer} className={`px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 hover:bg-blue-500 text-black"}`}>Start</button>
          ) : (
            <button onClick={pauseTimer} className={`px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105 bg-yellow-500 hover:bg-yellow-600 text-black`}>Pause</button>
          )}
          <button onClick={resetTimer} className={`px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105 bg-red-600 hover:bg-red-700 text-white`}>Reset</button>
        </div>
        {/* Session Progress */}
        <div className="flex gap-2 mb-4">
          {[...Array(SESSIONS_BEFORE_LONG_BREAK)].map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full transition-colors duration-500 ${
                i < (sessions % SESSIONS_BEFORE_LONG_BREAK) && isWork
                  ? "bg-green-400"
                  : isDarkMode
                  ? "bg-gray-600"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} transition-colors duration-500`}>
          Session {sessions + 1} {isWork ? "(Work)" : "(Break)"}
        </p>
      </div>
    </div>
  );
}
