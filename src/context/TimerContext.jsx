import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const startTimer = (taskId, projectId) => {
    setActiveTimer({ taskId, projectId, startTime: Date.now() });
  };

  const stopTimer = () => {
    setActiveTimer(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider value={{
      activeTimer,
      elapsedTime,
      startTimer,
      stopTimer,
      formatTime
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);