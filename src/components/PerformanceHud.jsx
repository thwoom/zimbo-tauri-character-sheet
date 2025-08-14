import React, { useEffect, useState } from 'react';
import usePerformanceMetrics from '../hooks/usePerformanceMetrics.js';

const styles = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#0f0',
  padding: '8px',
  fontFamily: 'monospace',
  fontSize: '12px',
  zIndex: 9999,
};

export default function PerformanceHud() {
  const metrics = usePerformanceMetrics();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let frame;
    const update = () => {
      forceUpdate((n) => n + 1);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={styles}>
      <div>Render: {metrics.current.renderDuration.toFixed(2)} ms</div>
      <div>Update: {metrics.current.updatesPerSecond.toFixed(2)} /s</div>
    </div>
  );
}
