import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import PerformanceHud from './PerformanceHud';

vi.mock('../hooks/usePerformanceMetrics.js', () => ({
  default: () => ({
    current: { renderDuration: 12.34, updatesPerSecond: 56.78 },
  }),
}));

describe('PerformanceHud', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', () => 0);
    vi.stubGlobal('cancelAnimationFrame', () => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('displays deterministic performance metrics', () => {
    render(<PerformanceHud />);
    expect(screen.getByText('Render: 12.34 ms')).toBeInTheDocument();
    expect(screen.getByText('Update: 56.78 /s')).toBeInTheDocument();
  });
});
