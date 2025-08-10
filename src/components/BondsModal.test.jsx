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
});
