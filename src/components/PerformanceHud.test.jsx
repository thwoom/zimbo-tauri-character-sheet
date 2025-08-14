/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import PerformanceHud from './PerformanceHud.jsx';

vi.mock('../hooks/usePerformanceMetrics.js', () => ({
  default: vi.fn(() => ({
    current: { renderDuration: 12.34, updatesPerSecond: 56.78 },
  })),
}));

describe('PerformanceHud', () => {
  let originalRAF;
  let originalCAF;

  beforeEach(() => {
    originalRAF = globalThis.requestAnimationFrame;
    originalCAF = globalThis.cancelAnimationFrame;
    globalThis.requestAnimationFrame = () => 0;
    globalThis.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
    vi.clearAllMocks();
  });

  it('displays performance metrics from hook', () => {
    render(<PerformanceHud />);
    expect(screen.getByText('Render: 12.34 ms')).toBeInTheDocument();
    expect(screen.getByText('Update: 56.78 /s')).toBeInTheDocument();
  });
});
