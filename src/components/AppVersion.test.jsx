import { getVersion } from '@tauri-apps/api/app';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import AppVersion from './AppVersion.tsx';

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn(),
}));

describe('AppVersion', () => {
  it('renders the retrieved version', async () => {
    getVersion.mockResolvedValueOnce('1.2.3');
    render(<AppVersion />);
    expect(await screen.findByText(/Version: 1.2.3/)).toBeInTheDocument();
  });

  it('shows a fallback message when version retrieval fails', async () => {
    getVersion.mockRejectedValueOnce(new Error('fail'));
    render(<AppVersion />);
    expect(await screen.findByText(/Version: Version unavailable/)).toBeInTheDocument();
  });
});
