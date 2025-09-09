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
      const nextSessionCount = isWork ? sessions + 1 : sessions;
      setSessions(nextSessionCount);

      if (isWork) {
        if (nextSessionCount % SESSIONS_BEFORE_LONG_BREAK === 0) {
          setTimeLeft(longBreak);
        } else {
          setTimeLeft(shortBreak);
        }
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

  const totalTime = isWork
    ? workTime
    : sessions % SESSIONS_BEFORE_LONG_BREAK === 0
    ? longBreak
    : shortBreak;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
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
              stroke="var(--muted)"
              strokeWidth="8"
              fill="transparent"
              r="100"
              cx="112"
              cy="112"
            />
            <circle
              stroke={isWork ? "var(--destructive)" : "var(--accent)"}
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
          className="flex flex-col md:flex-row gap-6 mb-6 w-full max-w-xl justify-center p-6 rounded-xl"
          style={{ backgroundColor: "var(--card)" }}
        >
          {[
            { label: "Work", value: Math.floor(workTime / 60), onChange: handleWorkTimeChange },
            { label: "Short Break", value: Math.floor(shortBreak / 60), onChange: handleShortBreakChange },
            { label: "Long Break", value: Math.floor(longBreak / 60), onChange: handleLongBreakChange },
          ].map((input) => (
            <div
              key={input.label}
              className="flex flex-col items-center p-4 rounded-lg shadow-inner w-28 transition-colors duration-300"
              style={{
                backgroundColor: "var(--card)",
                color: "var(--card-foreground)"
              }}
            >
              <label className="text-sm mb-2 font-medium">{input.label} (min)</label>
              <input
                type="number"
                min="1"
                value={input.value}
                onChange={input.onChange}
                className="w-full text-center px-2 py-1 rounded-md border focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  backgroundColor: "var(--input)"
                }}
              />
            </div>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105"
            style={{
              backgroundColor: isRunning ? "var(--accent)" : "var(--primary)",
              color: "var(--primary-foreground)"
            }}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2 rounded-full font-semibold shadow-lg transform transition-transform hover:scale-105"
            style={{
              backgroundColor: "var(--destructive)",
              color: "var(--primary-foreground)"
            }}
          >
            Reset
          </button>
        </div>

        {/* Session Progress */}
        <div className="flex gap-2 mb-4">
          {[...Array(SESSIONS_BEFORE_LONG_BREAK)].map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full transition-colors duration-500"
              style={{
                backgroundColor:
                  i < sessions % SESSIONS_BEFORE_LONG_BREAK
                    ? "var(--accent)"
                    : "var(--muted)"
              }}
            />
          ))}
        </div>

        <p className="text-sm transition-colors duration-500">
          Session {sessions + 1} {isWork ? "(Work)" : "(Break)"}
        </p>
      </div>
    </div>
  );
}
