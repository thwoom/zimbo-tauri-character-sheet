import { render, waitFor } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import usePerformanceMetrics from './usePerformanceMetrics.js';

function TestComponent({ onUpdate }) {
  const metrics = usePerformanceMetrics();
  const [count, setCount] = useState(0);

  useEffect(() => {
    onUpdate({ ...metrics.current });
    if (count === 0) setCount(1);
  }, [onUpdate, metrics, count]);

  return null;
}

describe('usePerformanceMetrics', () => {
  it('records render metrics', async () => {
    const calls = [];
    render(<TestComponent onUpdate={(m) => calls.push(m)} />);

    await waitFor(() => {
      expect(calls.length).toBeGreaterThan(1);
    });

    const last = calls.at(-1);
    expect(last.renderDuration).toBeGreaterThanOrEqual(0);
    expect(last.updatesPerSecond).toBeGreaterThan(0);
  });
});
