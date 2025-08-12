/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import LastBreathModal from './LastBreathModal.jsx';

describe('LastBreathModal', () => {
  it('toggles visibility with isOpen prop', () => {
    const onClose = vi.fn();
    const { rerender } = render(<LastBreathModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByText(/Last Breath/)).not.toBeInTheDocument();
    rerender(<LastBreathModal isOpen onClose={onClose} />);
    expect(screen.getByText(/Last Breath/)).toBeInTheDocument();
  });

  it('shows success outcome on 10+', async () => {
    const user = userEvent.setup();
    const rollDie = vi.fn().mockReturnValueOnce(6).mockReturnValueOnce(5);
    render(<LastBreathModal isOpen onClose={() => {}} rollDie={rollDie} />);
    await user.click(screen.getByText('Roll'));
    expect(screen.getByText('You survive by sheer will!')).toBeInTheDocument();
  });

  it('shows bargain outcome on 7-9', async () => {
    const user = userEvent.setup();
    const rollDie = vi.fn().mockReturnValueOnce(3).mockReturnValueOnce(4);
    render(<LastBreathModal isOpen onClose={() => {}} rollDie={rollDie} />);
    await user.click(screen.getByText('Roll'));
    expect(screen.getByText('Death offers a bargain.')).toBeInTheDocument();
  });

  it('shows death outcome on 6-', async () => {
    const user = userEvent.setup();
    const rollDie = vi.fn().mockReturnValueOnce(1).mockReturnValueOnce(2);
    render(<LastBreathModal isOpen onClose={() => {}} rollDie={rollDie} />);
    await user.click(screen.getByText('Roll'));
    expect(screen.getByText('Your time has come.')).toBeInTheDocument();
  });
});
