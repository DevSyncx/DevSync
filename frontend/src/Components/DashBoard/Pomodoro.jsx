// src/Components/DashBoard/Pomodoro.jsx
import React from "react";
import { useTimer } from "../../context/TimerContext";
import { useNavigate } from "react-router-dom";

const Pomodoro = () => {
  const navigate = useNavigate();
  const {
    timeLeft,
    isWork,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <section className="min-h-screen bg-[#DCE6EC] flex flex-col items-center justify-center px-4 md:px-10 relative">
      {/* Close button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded text-sm sm:text-base md:text-lg"
      >
        Close
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 pt-4 text-center">
        POMODORO TIMER!
      </h2>

      {/* Session label */}
      {isActive && (
        <h4
          className={`absolute top-20 px-4 py-2 sm:px-6 sm:py-2 rounded text-white text-lg sm:text-xl md:text-2xl ${
            isWork ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {isWork ? "Work Session" : "Take a Break"}
        </h4>
      )}

      <div className="text-center mt-20 w-full">
        {isActive ? (
          <>
            {/* Timer */}
            <h1 className="text-[70px] sm:text-[100px] md:text-[130px] lg:text-[170px] font-bold">
              {formatTime(timeLeft)}
            </h1>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button
                onClick={pauseTimer}
                className="bg-orange-400 text-black px-6 py-3 sm:px-8 sm:py-3 text-lg sm:text-xl md:text-2xl rounded shadow-md font-bold hover:scale-105 duration-100"
              >
                Pause
              </button>
              <button
                onClick={resetTimer}
                className="bg-red-400 text-black px-6 py-3 sm:px-8 sm:py-3 text-lg sm:text-xl md:text-2xl rounded shadow-md font-bold hover:scale-105 duration-100"
              >
                Reset
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={startTimer}
            className="bg-yellow-400 text-black px-6 py-3 sm:px-8 sm:py-3 text-lg sm:text-xl md:text-2xl rounded shadow-md font-bold hover:scale-105 duration-100"
          >
            Start Pomodoro
          </button>
        )}
      </div>
    </section>
  );
};

export default Pomodoro;
