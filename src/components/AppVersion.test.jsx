import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import AppVersion from './AppVersion.tsx';

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('1.2.3'),
}));

describe('AppVersion', () => {
  it('renders the retrieved version', async () => {
    render(<AppVersion />);
    expect(await screen.findByText(/Version: 1.2.3/)).toBeInTheDocument();
  });
});
