/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import RollModal from './RollModal.jsx';

describe('RollModal', () => {
  it('toggles visibility with isOpen prop', () => {
    const data = { result: '7' };
    const { rerender } = render(<RollModal isOpen={false} data={data} onClose={() => {}} />);
    expect(screen.queryByText('7')).not.toBeInTheDocument();
    rerender(<RollModal isOpen data={data} onClose={() => {}} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows roll data and handles closing', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const data = { result: '12', description: 'Great roll', context: 'STR Check' };

    render(<RollModal isOpen data={data} onClose={onClose} />);

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Great roll')).toBeInTheDocument();
    expect(screen.getByText('STR Check')).toBeInTheDocument();

    await user.click(screen.getByText('×'));
    await user.click(screen.getByText('Close'));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
