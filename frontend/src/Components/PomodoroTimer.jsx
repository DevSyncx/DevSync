import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // default 25 min
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [history, setHistory] = useState({}); // track completed minutes per date

  // countdown
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      // update history when completed
      const today = new Date().toDateString();
      setHistory((prev) => ({
        ...prev,
        [today]: (prev[today] || 0) + inputMinutes,
      }));
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // reset
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(inputMinutes * 60);
  };

  // format mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // progress %
  const progress = ((inputMinutes * 60 - timeLeft) / (inputMinutes * 60)) * 100;

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {/* Timer Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Pomodoro Timer
        </h2>

        {/* Time Display */}
        <div className="text-5xl font-mono text-center text-gray-800">
          {formatTime(timeLeft)}
        </div>

        {/* Progress bar + % */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-indigo-500 h-4 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-gray-600 font-medium">
          {progress.toFixed(1)}%
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white shadow hover:bg-indigo-600 cursor-pointer"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 shadow hover:bg-gray-400 cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Modern Time Input */}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-gray-600 font-medium">Set Duration</span>

          {/* Preset quick buttons */}
          <div className="flex space-x-2">
            {[15, 25, 45, 60].map((min) => (
              <button
                key={min}
                onClick={() => {
                  setInputMinutes(min);
                  setTimeLeft(min * 60);
                  setIsRunning(false);
                }}
                className={`px-3 py-1 rounded-lg shadow text-sm transition cursor-pointer ${
                  inputMinutes === min
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {min}m
              </button>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            min="5"
            max="120"
            value={inputMinutes}
            onChange={(e) => {
              const val = Number(e.target.value);
              setInputMinutes(val);
              setTimeLeft(val * 60);
              setIsRunning(false);
            }}
            className="w-64 accent-indigo-500 cursor-pointer"
          />

          <span className="text-gray-700 font-semibold">
            {inputMinutes} minutes
          </span>
        </div>
      </div>

      {/* Calendar tracking */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Work History
        </h3>
        <Calendar
          tileContent={({ date }) => {
            const today = date.toDateString();
            return history[today] ? (
              <p className="text-xs text-indigo-600 font-bold">
                {history[today]}m
              </p>
            ) : null;
          }}
          className="rounded-lg border"
        />
      </div>
    </div>
  );
}

