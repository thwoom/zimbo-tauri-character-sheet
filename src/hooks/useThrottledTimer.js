import { useEffect, useRef, useState } from 'react';

export default function useThrottledTimer(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    const start = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setNow(Date.now());
      }, intervalMs);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(timerRef.current);
      } else {
        start();
      }
    };

    if (!document.hidden) {
      start();
    }

    window.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [intervalMs]);

  return now;
}
