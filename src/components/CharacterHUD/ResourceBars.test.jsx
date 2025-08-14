/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResourceBars from './ResourceBars.jsx';

describe('ResourceBars', () => {
  const defaultProps = {
    primary: { current: 50, max: 100 },
    secondary: { current: 30, max: 50 },
    shield: { current: 10, max: 100 },
  };

  it('exposes aria attributes and toggles display on hover', () => {
    render(<ResourceBars {...defaultProps} />);
    const [primaryBar, secondaryBar] = screen.getAllByRole('progressbar');
    expect(primaryBar).toHaveAttribute('aria-valuenow', '50');
    expect(primaryBar).toHaveAttribute('aria-valuemin', '0');
    expect(primaryBar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('50/100')).toBeInTheDocument();
    fireEvent.mouseEnter(primaryBar.parentElement);
    expect(screen.getByText('50%')).toBeInTheDocument();
    fireEvent.mouseLeave(primaryBar.parentElement);
    expect(screen.getByText('50/100')).toBeInTheDocument();
    expect(secondaryBar).toHaveAttribute('aria-valuenow', '30');
    expect(secondaryBar).toHaveAttribute('aria-valuemax', '50');
  });

  it('renders shield bar when shield value provided', () => {
    render(<ResourceBars {...defaultProps} />);
    expect(screen.getByTestId('shield-bar')).toBeInTheDocument();
  });
});
