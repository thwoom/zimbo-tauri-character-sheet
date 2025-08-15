import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import DiagnosticOverlay from './DiagnosticOverlay.jsx';

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('1.2.3'),
}));

describe('DiagnosticOverlay', () => {
  it('displays version, build timestamp and HUD status', async () => {
    render(<DiagnosticOverlay hudMounted={true} />);

    expect(await screen.findByText(/Version: 1.2.3/)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Build: ${import.meta.env.VITE_BUILD_TIMESTAMP}`)),
    ).toBeInTheDocument();
    expect(screen.getByText(/HUD: mounted/)).toBeInTheDocument();
  });
});
