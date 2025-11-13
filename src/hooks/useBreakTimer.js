import { useState, useEffect } from 'react';

export const useBreakTimer = (isActive, startTime) => {
  const [elapsed, setElapsed] = useState(0);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  useEffect(() => {
    if (!isActive || !startTime) {
      setElapsed(0);
      setIsWarning(false);
      setIsDanger(false);
      return;
    }

    // Calculate initial elapsed time
    const start = new Date(startTime);
    const initialElapsed = Math.floor((Date.now() - start) / 1000);
    setElapsed(initialElapsed);

    // Start timer
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      setElapsed(diff);

      // Warning at 12 minutes (720 seconds)
      if (diff >= 720 && diff < 900) {
        setIsWarning(true);
        setIsDanger(false);
      }
      // Danger at 15 minutes (900 seconds)
      else if (diff >= 900) {
        setIsWarning(false);
        setIsDanger(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const minutes = Math.floor(elapsed / 60);
  const remainingMinutes = Math.max(0, 15 - minutes);

  return {
    elapsed,
    formattedTime: formatTime(elapsed),
    minutes,
    remainingMinutes,
    isWarning,
    isDanger,
    percentage: Math.min((elapsed / 900) * 100, 100) // 900 = 15 minutes
  };
};