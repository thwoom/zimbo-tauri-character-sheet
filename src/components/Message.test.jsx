/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';
import Message from './Message.jsx';

describe('Message', () => {
  it('renders children with default error class', () => {
    render(<Message>Oops</Message>);
    const msg = screen.getByText('Oops');
    expect(msg).toHaveClass('message', 'message-error');
  });

  it('applies type class when provided', () => {
    render(<Message type="warning">Heads up</Message>);
    const msg = screen.getByText('Heads up');
    expect(msg).toHaveClass('message', 'message-warning');
  });
});
