/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterContext from '../state/CharacterContext.jsx';
import BondsModal from './BondsModal.jsx';

function renderWithCharacter(ui) {
  const Wrapper = ({ children }) => {
    const [character, setCharacter] = React.useState({ bonds: [] });
    return (
      <CharacterContext.Provider value={{ character, setCharacter }}>
        {children}
      </CharacterContext.Provider>
    );
  };
  return render(ui, { wrapper: Wrapper });
}

describe('BondsModal', () => {
  it('toggles visibility with isOpen prop', () => {
    const onClose = vi.fn();
    const { rerender } = renderWithCharacter(
      <BondsModal isOpen={false} onClose={onClose} />, // initially closed
    );
    expect(screen.queryByText(/Character Bonds/i)).not.toBeInTheDocument();
    rerender(<BondsModal isOpen onClose={onClose} />);
    expect(screen.getByText(/Character Bonds/i)).toBeInTheDocument();
  });

  it('adds, resolves, and removes bonds', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithCharacter(<BondsModal isOpen onClose={onClose} />);

    await user.type(screen.getByPlaceholderText('Name'), 'Alice');
    await user.type(screen.getByPlaceholderText('Relationship'), 'Friend');
    await user.click(screen.getByText('Add Bond'));
    expect(screen.getByText('Alice')).toBeInTheDocument();

    await user.click(screen.getByText('Resolve'));
    expect(screen.getByText('Unresolve')).toBeInTheDocument();

    await user.click(screen.getByText('Remove'));
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();

    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('wraps action buttons when width is constrained', () => {
    const onClose = vi.fn();
    renderWithCharacter(<BondsModal isOpen onClose={onClose} />);
    const group = screen.getByText('Add Bond').parentElement;
    group.style.display = 'flex';
    group.style.flexWrap = 'wrap';
    Object.defineProperty(group, 'clientHeight', {
      configurable: true,
      get() {
        return group.style.width === '120px' ? 60 : 30;
      },
    });
    expect(getComputedStyle(group).flexWrap).toBe('wrap');
    const initialHeight = group.clientHeight;
    group.style.width = '120px';
    expect(group.clientHeight).toBeGreaterThan(initialHeight);
  });

  it('renders action buttons without overflow on narrow screens', () => {
    const onClose = vi.fn();
    document.body.style.width = '320px';
    renderWithCharacter(<BondsModal isOpen onClose={onClose} />);
    const group = screen.getByText('Add Bond').parentElement;
    group.style.overflowX = 'auto';
    expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
  });
});
