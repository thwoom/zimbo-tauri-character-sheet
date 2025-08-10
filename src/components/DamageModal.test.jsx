/* eslint-env jest */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterContext from '../state/CharacterContext.jsx';
import DamageModal from './DamageModal.jsx';

function renderWithCharacter(ui, { character }) {
  const Wrapper = ({ children }) => {
    const [charState, setCharState] = React.useState(character);
    return (
      <CharacterContext.Provider value={{ character: charState, setCharacter: setCharState }}>
        {children}
        <div data-testid="hp">{charState.hp}</div>
      </CharacterContext.Provider>
    );
  };
  return render(ui, { wrapper: Wrapper });
}

describe('DamageModal', () => {
  it('toggles visibility with isOpen prop', () => {
    const onClose = vi.fn();
    const initial = { hp: 10, armor: 0, inventory: [], actionHistory: [] };
    const { rerender } = renderWithCharacter(<DamageModal isOpen={false} onClose={onClose} />, {
      character: initial,
    });
    expect(screen.queryByText(/Damage Calculator/i)).not.toBeInTheDocument();
    rerender(<DamageModal isOpen onClose={onClose} />);
    expect(screen.getByText(/Damage Calculator/i)).toBeInTheDocument();
  });

  it('applies damage accounting for armor', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const initial = {
      hp: 10,
      armor: 1,
      inventory: [{ id: 1, armor: 1, equipped: true }],
      actionHistory: [],
    };
    renderWithCharacter(<DamageModal isOpen onClose={onClose} />, { character: initial });

    await user.type(screen.getByPlaceholderText('Incoming damage'), '5');
    await user.click(screen.getByText('Apply'));

    await waitFor(() => expect(screen.getByTestId('hp')).toHaveTextContent('7'));
    expect(onClose).toHaveBeenCalled();
  });

  it('cancels without changing hp', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const initial = { hp: 10, armor: 0, inventory: [], actionHistory: [] };
    renderWithCharacter(<DamageModal isOpen onClose={onClose} />, { character: initial });

    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
    expect(screen.getByTestId('hp')).toHaveTextContent('10');
  });
});
