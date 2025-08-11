/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import useModal from './useModal.js';

function TestComponent() {
  const { isOpen, open, close } = useModal();
  return (
    <div>
      <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
    </div>
  );
}

describe('useModal', () => {
  it('controls modal state', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    const status = screen.getByTestId('status');
    expect(status).toHaveTextContent('closed');
    await user.click(screen.getByText('Open'));
    expect(status).toHaveTextContent('open');
    await user.click(screen.getByText('Close'));
    expect(status).toHaveTextContent('closed');
  });
});
