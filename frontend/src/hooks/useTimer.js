import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (initialSeconds, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      onExpireRef.current?.();
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((seconds) => {
    setIsRunning(false);
    setTimeLeft(seconds ?? initialSeconds);
  }, [initialSeconds]);

  const formatted = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;
  const percentage = (timeLeft / initialSeconds) * 100;
  const isWarning = timeLeft <= 30;
  const isDanger = timeLeft <= 10;

  return { timeLeft, isRunning, formatted, percentage, isWarning, isDanger, start, pause, reset };
};