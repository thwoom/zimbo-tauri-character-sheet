/* eslint-env jest */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';
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
    const onLastBreath = vi.fn();
    const initial = { hp: 10, armor: 0, inventory: [], actionHistory: [] };
    const { rerender } = renderWithCharacter(
      <DamageModal isOpen={false} onClose={onClose} onLastBreath={onLastBreath} />,
      {
        character: initial,
      },
    );
    expect(screen.queryByText(/Damage Calculator/i)).not.toBeInTheDocument();
    rerender(<DamageModal isOpen onClose={onClose} onLastBreath={onLastBreath} />);
    expect(screen.getByText(/Damage Calculator/i)).toBeInTheDocument();
  });

  it('applies damage accounting for armor', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onLastBreath = vi.fn();
    const initial = {
      hp: 10,
      armor: 1,
      inventory: [{ id: 1, armor: 1, equipped: true }],
      actionHistory: [],
    };
    renderWithCharacter(<DamageModal isOpen onClose={onClose} onLastBreath={onLastBreath} />, {
      character: initial,
    });

    await user.type(screen.getByPlaceholderText('Incoming damage'), '5');
    await user.click(screen.getByText('Apply'));

    await waitFor(() => expect(screen.getByTestId('hp')).toHaveTextContent('7'));
    expect(onClose).toHaveBeenCalled();
  });

  it('cancels without changing hp', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onLastBreath = vi.fn();
    const initial = { hp: 10, armor: 0, inventory: [], actionHistory: [] };
    renderWithCharacter(<DamageModal isOpen onClose={onClose} onLastBreath={onLastBreath} />, {
      character: initial,
    });

    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
    expect(screen.getByTestId('hp')).toHaveTextContent('10');
    expect(onLastBreath).not.toHaveBeenCalled();
  });

  it('triggers Last Breath when hp drops to zero', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onLastBreath = vi.fn();
    const initial = { hp: 5, armor: 0, inventory: [], actionHistory: [] };
    renderWithCharacter(<DamageModal isOpen onClose={onClose} onLastBreath={onLastBreath} />, {
      character: initial,
    });

    await user.type(screen.getByPlaceholderText('Incoming damage'), '5');
    await user.click(screen.getByText('Apply'));

    await waitFor(() => expect(onLastBreath).toHaveBeenCalled());
  });

  it('includes flex-wrap styling for action buttons', () => {
    const css = fs.readFileSync(path.resolve(__dirname, './DamageModal.module.css'), 'utf8');
    expect(css).toMatch(/\.buttonGroup[^}]*flex-wrap:\s*wrap/);
  });
});
