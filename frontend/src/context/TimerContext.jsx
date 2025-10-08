import { createContext, useContext, useState, useEffect } from "react";

const TimerContext = createContext();

export function useTimer() {
  return useContext(TimerContext);
}

const SESSIONS_BEFORE_LONG_BREAK = 4;

export function TimerProvider({ children }) {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [shortBreak, setShortBreak] = useState(5 * 60);
  const [longBreak, setLongBreak] = useState(15 * 60);

  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem("pomodoroSessions")) || 0);

  const [endTimestamp, setEndTimestamp] = useState(() => {
    const saved = localStorage.getItem("pomodoroEndTimestamp");
    return saved ? Number(saved) : null;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("pomodoroTimeLeft");
    return saved ? Number(saved) : workTime;
  });

  // Timer tick using requestAnimationFrame
  useEffect(() => {
    let raf;

    const tick = () => {
      if (isRunning && endTimestamp) {
        const now = Date.now();
        const remaining = Math.max(Math.ceil((endTimestamp - now) / 1000), 0);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          handleSessionEnd();
        } else {
          raf = requestAnimationFrame(tick);
        }
      }
    };

    if (isRunning) {
      raf = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(raf);
  }, [isRunning, endTimestamp]);

  // Persist timer info
  useEffect(() => localStorage.setItem("pomodoroTimeLeft", timeLeft), [timeLeft]);
  useEffect(() => localStorage.setItem("pomodoroSessions", sessions), [sessions]);
  useEffect(() => {
    if (endTimestamp) localStorage.setItem("pomodoroEndTimestamp", endTimestamp);
  }, [endTimestamp]);

  const handleSessionEnd = () => {
    const nextSession = isWork ? sessions + 1 : sessions;
    setSessions(nextSession);
    const nextTime = isWork
      ? nextSession % SESSIONS_BEFORE_LONG_BREAK === 0
        ? longBreak
        : shortBreak
      : workTime;

    setIsWork(prev => !prev);
    setTimeLeft(nextTime);
    setEndTimestamp(Date.now() + nextTime * 1000);
    setIsRunning(true);

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(
        isWork ? "Work session complete! Time for a break 🎉" : "Break over! Back to work 💻"
      );
    }
  };

  const startTimer = () => {
    if (!endTimestamp) setEndTimestamp(Date.now() + timeLeft * 1000);
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setIsWork(true);
    setTimeLeft(workTime);
    setSessions(0);
    setEndTimestamp(null);
  };

  const updateWorkTime = (minutes) => {
    const secs = Math.max(1, minutes) * 60;
    setWorkTime(secs);
    if (isWork) {
      setTimeLeft(secs);
      setEndTimestamp(Date.now() + secs * 1000);
    }
  };
  const updateShortBreak = (minutes) => {
    const secs = Math.max(1, minutes) * 60;
    setShortBreak(secs);
    if (!isWork && sessions % SESSIONS_BEFORE_LONG_BREAK !== 0) {
      setTimeLeft(secs);
      setEndTimestamp(Date.now() + secs * 1000);
    }
  };
  const updateLongBreak = (minutes) => {
    const secs = Math.max(1, minutes) * 60;
    setLongBreak(secs);
    if (!isWork && sessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
      setTimeLeft(secs);
      setEndTimestamp(Date.now() + secs * 1000);
    }
  };

  // Request notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <TimerContext.Provider
      value={{
        workTime,
        shortBreak,
        longBreak,
        timeLeft,
        isRunning,
        isWork,
        sessions,
        startTimer,
        pauseTimer,
        resetTimer,
        updateWorkTime,
        updateShortBreak,
        updateLongBreak,
        SESSIONS_BEFORE_LONG_BREAK,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
