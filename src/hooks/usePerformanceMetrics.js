import { useRef, useEffect } from 'react';

export default function usePerformanceMetrics() {
  const metricsRef = useRef({ renderDuration: 0, updatesPerSecond: 0 });
  const startRef = useRef(performance.now());
  const lastRenderRef = useRef(performance.now());

  startRef.current = performance.now();

  useEffect(() => {
    const now = performance.now();
    const renderDuration = now - startRef.current;
    const delta = now - lastRenderRef.current;
    const updatesPerSecond = delta > 0 ? 1000 / delta : 0;

    metricsRef.current = { renderDuration, updatesPerSecond };
    lastRenderRef.current = now;
  });

  return metricsRef;
}
