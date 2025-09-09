import { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import ThemeContext from "../ui/theme-provider.jsx";

const SESSIONS_BEFORE_LONG_BREAK = 4;

export default function PomodoroTimer() {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  // Timer settings
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

  // Timer countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Session switch logic
  useEffect(() => {
    if (timeLeft <= 0) {
      if (isWork) {
        const nextSessionCount = sessions + 1;
        setSessions(nextSessionCount);

        if (nextSessionCount % SESSIONS_BEFORE_LONG_BREAK === 0) {
          setTimeLeft(longBreak);
        } else {
          setTimeLeft(shortBreak);
        }
      } else {
        setTimeLeft(workTime);
      }
      setIsWork(!isWork);

      // Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(
          isWork
            ? "Work session complete! Time for a break 🎉"
            : "Break over! Back to work 💻"
        );
      }
    }
  }, [timeLeft, isWork, sessions, workTime, shortBreak, longBreak]);

  // Request notification permission
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

  const totalTime = isWork
    ? workTime
    : sessions % SESSIONS_BEFORE_LONG_BREAK === 0
    ? longBreak
    : shortBreak;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isDarkMode ? "bg-[#101e35] text-white" : "bg-gradient-to-br from-blue-100 to-white text-black"
      }`}
    >
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-6">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {isWork ? "Focus Time 💻" : "Break Time ☕"}
        </h1>

        {/* Circular Progress Timer */}
        <div className="relative w-56 h-56 mb-6">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              className={`stroke-gray-400 ${isDarkMode ? "stroke-gray-700" : ""}`}
              strokeWidth="8"
              fill="transparent"
              r="100"
              cx="112"
              cy="112"
            />
            <circle
              className={`transition-all duration-500 ${
                isWork ? "stroke-red-500" : "stroke-green-500"
              }`}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progress / 100)}
              strokeLinecap="round"
              fill="transparent"
              r="100"
              cx="112"
              cy="112"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Duration Inputs */}
        <div
          className={`flex flex-col md:flex-row gap-6 mb-6 w-full max-w-xl justify-center p-6 rounded-xl 0`}
        >
          {[
            { label: "Work", value: Math.floor(workTime / 60), onChange: handleWorkTimeChange },
            { label: "Short Break", value: Math.floor(shortBreak / 60), onChange: handleShortBreakChange },
            { label: "Long Break", value: Math.floor(longBreak / 60), onChange: handleLongBreakChange },
          ].map((input) => (
            <div
              key={input.label}
              className="flex flex-col items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner w-28 transition-colors duration-300"
            >
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
        <div className="flex gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className={`px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105 ${
                isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 hover:bg-blue-500 text-black"
              }`}
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className={`px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105 ${
                isDarkMode ? "bg-yellow-500 hover:bg-yellow-600" : "bg-yellow-300 hover:bg-yellow-400 text-black"
              }`}
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className={`px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105 ${
              isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-400 hover:bg-red-500 text-black"
            }`}
          >
            Reset
          </button>
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
