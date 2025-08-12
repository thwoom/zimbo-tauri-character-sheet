import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import LastBreathModal from './LastBreathModal.jsx';

describe('LastBreathModal', () => {
  it('rolls 2d6 and shows outcome', () => {
    const rollDie = vi.fn().mockReturnValueOnce(4).mockReturnValueOnce(5); // total 9
    render(<LastBreathModal isOpen onClose={() => {}} rollDie={rollDie} />);
    expect(screen.getByText('Roll: 9')).toBeInTheDocument();
    expect(screen.getByText(/Death offers you a bargain/i)).toBeInTheDocument();
  });
});
