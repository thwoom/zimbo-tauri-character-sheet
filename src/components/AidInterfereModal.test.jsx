/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import AidInterfereModal from './AidInterfereModal.jsx';

describe('AidInterfereModal', () => {
  it('toggles visibility with isOpen', () => {
    const { rerender } = render(
      <AidInterfereModal isOpen={false} onConfirm={() => {}} onCancel={() => {}} />,
    );
    expect(screen.queryByText('Aid or Interfere')).not.toBeInTheDocument();
    rerender(<AidInterfereModal isOpen onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('Aid or Interfere')).toBeInTheDocument();
  });

  it('submits selected action and bond', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<AidInterfereModal isOpen onConfirm={onConfirm} onCancel={() => {}} />);

    await user.click(screen.getByLabelText('Interfere'));
    const bondInput = screen.getByLabelText('Bond');
    await user.clear(bondInput);
    await user.type(bondInput, '2');
    await user.click(screen.getByText('Confirm'));

    expect(onConfirm).toHaveBeenCalledWith({ action: 'interfere', bond: 2 });
  });

  it('handles cancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<AidInterfereModal isOpen onConfirm={() => {}} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
