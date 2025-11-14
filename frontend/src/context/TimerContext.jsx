import { createContext, useContext, useState, useEffect } from "react";

// --- This is the ID of your companion Chrome Extension ---
const EXTENSION_ID = import.meta.env.VITE_CHROME_EXTENSION_ID;

const TimerContext = createContext();

export function useTimer() {
  return useContext(TimerContext);
}

const SESSIONS_BEFORE_LONG_BREAK = 4;

const isExtensionInstalled = () => {
  return window.chrome && window.chrome.runtime && EXTENSION_ID;
};

const sendStartTimerMessage = (state) => {
  if (isExtensionInstalled()) {
    chrome.runtime.sendMessage(EXTENSION_ID, {
      command: "startTimer", 
      endTime: Date.now() + state.timeLeft * 1000,
      sessionType: state.sessionType,
      sessionCount: state.sessions,
      settings: {
        workTime: state.workTime,
        shortBreak: state.shortBreak,
        longBreak: state.longBreak,
        SESSIONS_BEFORE_LONG_BREAK: SESSIONS_BEFORE_LONG_BREAK
      }
    }, (response) => {
      if (chrome.runtime.lastError) console.error(`Could not start timer: ${chrome.runtime.lastError.message}`);
      else console.log("Extension acknowledged timer start.", response);
    });
  }
};

const sendStopTimerMessage = () => {
  if (isExtensionInstalled()) {
    chrome.runtime.sendMessage(EXTENSION_ID, {
      command: "stopTimer"
    }, (response) => {
      if (chrome.runtime.lastError) console.error(`Could not stop timer: ${chrome.runtime.lastError.message}`);
      else console.log("Extension acknowledged timer stop.", response);
    });
  }
};


export function TimerProvider({ children }) {
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [workTime, setWorkTime] = useState(() => {
    const saved = localStorage.getItem("devsync-workTime");
    return saved ? Number(saved) : 25 * 60; 
  });
  const [shortBreak, setShortBreak] = useState(() => {
    const saved = localStorage.getItem("devsync-shortBreak");
    return saved ? Number(saved) : 5 * 60;
  });
  const [longBreak, setLongBreak] = useState(() => {
    const saved = localStorage.getItem("devsync-longBreak");
    return saved ? Number(saved) : 15 * 60;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work');
  const [sessions, setSessions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workTime); 
  const [endTimestamp, setEndTimestamp] = useState(null);

  useEffect(() => localStorage.setItem("devsync-workTime", workTime), [workTime]);
  useEffect(() => localStorage.setItem("devsync-shortBreak", shortBreak), [shortBreak]);
  useEffect(() => localStorage.setItem("devsync-longBreak", longBreak), [longBreak]);
  
  useEffect(() => {
    if (isLoading || isExtensionConnected) {
      return;
    }
    
    localStorage.setItem("pomodoroTimeLeft", timeLeft);
    localStorage.setItem("pomodoroSessionType", sessionType);
    localStorage.setItem("pomodoroSessions", sessions);
    if (endTimestamp) {
      localStorage.setItem("pomodoroEndTimestamp", endTimestamp);
    } else {
      localStorage.removeItem("pomodoroEndTimestamp");
    }
  }, [timeLeft, sessionType, sessions, endTimestamp, isRunning, isExtensionConnected, isLoading]);

  useEffect(() => {
    const savedWorkTime = Number(localStorage.getItem("devsync-workTime")) || 25 * 60;
    const savedPausedTime = Number(localStorage.getItem("pomodoroTimeLeft"));
    const savedType = localStorage.getItem("pomodoroSessionType") || 'work';
    const savedSessions = Number(localStorage.getItem("pomodoroSessions")) || 0;

    const setFinalState = (mode, state) => {
      setIsExtensionConnected(mode === 'extension');
      setIsRunning(state.isRunning);
      setSessionType(state.sessionType);
      setSessions(state.sessions);
      setTimeLeft(state.timeLeft);
      setEndTimestamp(state.endTimestamp); 
      setIsLoading(false); 
    };

    if (isExtensionInstalled()) {
      chrome.runtime.sendMessage(EXTENSION_ID, { command: "getState" }, (state) => {
        if (chrome.runtime.lastError) {
          console.warn(`Extension connection failed: ${chrome.runtime.lastError.message}. Running in standalone mode.`);
          const savedEndTimestamp = Number(localStorage.getItem("pomodoroEndTimestamp"));
          if (savedEndTimestamp && savedEndTimestamp > Date.now()) {
            setFinalState('standalone', {
              isRunning: true,
              sessionType: savedType,
              sessions: savedSessions,
              timeLeft: Math.max(Math.ceil((savedEndTimestamp - Date.now()) / 1000), 0),
              endTimestamp: savedEndTimestamp
            });
          } else {
            setFinalState('standalone', {
              isRunning: false,
              sessionType: savedType,
              sessions: savedSessions,
              timeLeft: savedPausedTime || savedWorkTime,
              endTimestamp: null
            });
          }
        } else if (state) {
          console.log("Extension connected. Running in extension-controlled mode.", state);
          setFinalState('extension', {
            isRunning: state.isRunning || false,
            sessionType: state.timerSessionType || 'work',
            sessions: state.timerSessionCount || 0,
            timeLeft: (state.isRunning && state.timerEndTime) 
              ? Math.max(Math.ceil((state.timerEndTime - Date.now()) / 1000), 0)
              : (savedPausedTime || savedWorkTime),
            endTimestamp: null 
          });
        }
      });
    } else {
      console.log("No extension found. Running in standalone mode.");
      const savedEndTimestamp = Number(localStorage.getItem("pomodoroEndTimestamp"));
      if (savedEndTimestamp && savedEndTimestamp > Date.now()) {
        setFinalState('standalone', {
          isRunning: true,
          sessionType: savedType,
          sessions: savedSessions,
          timeLeft: Math.max(Math.ceil((savedEndTimestamp - Date.now()) / 1000), 0),
          endTimestamp: savedEndTimestamp
        });
      } else {
        setFinalState('standalone', {
          isRunning: false,
          sessionType: savedType,
          sessions: savedSessions,
          timeLeft: savedPausedTime || savedWorkTime,
          endTimestamp: null
        });
      }
    }
  }, []);
  useEffect(() => {
    if (isRunning && !isExtensionConnected) {
      const timerId = setInterval(() => {
        if (endTimestamp) {
          const now = Date.now();
          const remaining = Math.max(Math.ceil((endTimestamp - now) / 1000), 0);
          setTimeLeft(remaining);

          if (remaining <= 0) {
            handleLocalSessionEnd();
          }
        }
      }, 250);
      return () => clearInterval(timerId);
    }
  }, [isRunning, isExtensionConnected, endTimestamp]);
  
  const handleLocalSessionEnd = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(
        sessionType === 'work' ? "Work session complete! Time for a break" : "Break over! Back to work"
      );
    }

    let nextSessionType;
    let nextTime;

    if (sessionType === 'work') {
      const nextSessionNum = sessions + 1;
      setSessions(nextSessionNum);
      if (nextSessionNum % SESSIONS_BEFORE_LONG_BREAK === 0) {
        nextSessionType = 'longBreak';
        nextTime = longBreak;
      } else {
        nextSessionType = 'shortBreak';
        nextTime = shortBreak;
      }
    } else {
      if (sessionType === 'longBreak') {
        setIsRunning(false);
        setEndTimestamp(null);
        setSessions(0);
        setSessionType('work');
        setTimeLeft(workTime);
        return;
      } else {
        nextSessionType = 'work';
        nextTime = workTime;
      }
    }

    const newEndTimestamp = Date.now() + nextTime * 1000;
    setSessionType(nextSessionType);
    setTimeLeft(nextTime);
    setEndTimestamp(newEndTimestamp);
  };

  useEffect(() => {
    if (!isExtensionConnected) return;

    const handleMessage = (event) => {
      if (event.source !== window || !event.data || event.data.type !== "FROM_DEVSYNC_EXTENSION") {
        return;
      }
      const message = event.data.payload;
      
      if (message.action === "updateTime") {
        setTimeLeft(message.timeLeft);
      } 
      else if (message.action === "startTimer") {
        setIsRunning(true);
        setSessionType(message.sessionType);
        setSessions(message.sessionCount);
        const remaining = Math.max(Math.ceil((message.endTime - Date.now()) / 1000), 0);
        setTimeLeft(remaining);
      }
      else if (message.action === "stopTimer" || message.action === "hideTimer") {
        setIsRunning(false);
        setSessionType('work');
        setSessions(0);
        setWorkTime(currentWorkTime => {
          setTimeLeft(currentWorkTime);
          return currentWorkTime;
        });
        localStorage.removeItem("pomodoroTimeLeft");
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isExtensionConnected]);

  const startTimer = () => {
    setIsRunning(true);
    const savedTimeLeft = localStorage.getItem("pomodoroTimeLeft");
    const timeToStart = savedTimeLeft ? Number(savedTimeLeft) : (timeLeft > 0 ? timeLeft : workTime);
    localStorage.removeItem("pomodoroTimeLeft");

    if (isExtensionConnected) {
      sendStartTimerMessage({
        timeLeft: timeToStart,
        sessionType,
        sessions,
        workTime,
        shortBreak,
        longBreak
      });
    } else {
      console.warn(
        "DevSync: Extension not detected. Running in standalone mode.\n"
      );
      setEndTimestamp(Date.now() + timeToStart * 1000);
      setTimeLeft(timeToStart);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (isExtensionConnected) {
      sendStopTimerMessage();
    } else {
      setEndTimestamp(null);
    }
    localStorage.setItem("pomodoroTimeLeft", timeLeft); 
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSessionType('work');
    setTimeLeft(workTime); 
    setSessions(0);
    setEndTimestamp(null);
    
    if (isExtensionConnected) {
      sendStopTimerMessage();
    }
    localStorage.removeItem("pomodoroTimeLeft");
  };
  const updateWorkTime = (minutes) => {
    const secs = Math.max(1, minutes) * 60;
    setWorkTime(secs);
    if (sessionType === 'work' && !isRunning) setTimeLeft(secs);
  };
  const updateShortBreak = (minutes) => {
    const secs = Math.max(1, minutes) * 60;
    setShortBreak(secs);
    if (sessionType === 'shortBreak' && !isRunning) setTimeLeft(secs);
  };
  const updateLongBreak = (minutes) => {
    const secs = Math.max(1, minutes) * 60;
    setLongBreak(secs);
    if (sessionType === 'longBreak' && !isRunning) setTimeLeft(secs);
  };
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  
  const isWork = sessionType === 'work';

  return (
    <TimerContext.Provider
      value={{
        workTime,
        shortBreak,
        longBreak,
        timeLeft,
        isRunning,
        isWork, 
        sessionType, 
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