import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Pomodoro = () => {
const navigate=useNavigate()

  const [isWorkSession, setIsWorkSession] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };  

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(intervalRef.current);
            const nextIsWork = !isWorkSession;
            setIsWorkSession(nextIsWork);
            setTimeLeft(nextIsWork ? 25 * 60 : 5 * 60);
            setIsRunning(false);
          }    
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isWorkSession]);

  const startTimer = () => {
    if (!isRunning) setIsRunning(true);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsWorkSession(true);
  };

  return (
  <section className="min-h-screen bg-[#DCE6EC] flex flex-col items-center justify-center px-4 md:px-10">
    <button
      onClick={() => navigate(-1)}
      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded text-sm sm:text-base md:text-lg"
      id="3"
    >
      Close
    </button>

    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 pt-4 text-center">
      POMODORO TIMER!
    </h2>

    <h4
      className={`absolute top-20 px-4 py-2 sm:px-6 sm:py-2 rounded text-white text-lg sm:text-xl md:text-2xl ${
        isWorkSession ? 'bg-green-500' : 'bg-blue-500'
      }`}
    >
      {isWorkSession ? 'Work Session' : 'Take a Break'}
    </h4>

    <div className="text-center mt-20 w-full">
      <h1 className="text-[70px] sm:text-[100px] md:text-[130px] lg:text-[170px] font-bold">
        {formatTime(timeLeft)}
      </h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
        <button
          onClick={startTimer}
          className="bg-yellow-400 text-black px-6 py-3 sm:px-8 sm:py-3 text-lg sm:text-xl md:text-2xl rounded shadow-md font-bold hover:scale-105 duration-100"
        >
          Start
        </button>
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
    </div>
  </section>
);
};

export default Pomodoro;