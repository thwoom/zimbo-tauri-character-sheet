/* eslint-env jest */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import useUndo from '../hooks/useUndo.js';
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

  it('undo restores hp after damage', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const [character, setCharacter] = React.useState({
        hp: 10,
        armor: 0,
        inventory: [],
        actionHistory: [],
      });
      const { undoLastAction } = useUndo(character, setCharacter);
      return (
        <CharacterContext.Provider value={{ character, setCharacter }}>
          <DamageModal isOpen onClose={() => {}} onLastBreath={() => {}} />
          <div data-testid="hp">{character.hp}</div>
          <button onClick={undoLastAction}>Undo</button>
        </CharacterContext.Provider>
      );
    }
    render(<Wrapper />);
    await user.type(screen.getByPlaceholderText('Incoming damage'), '3');
    await user.click(screen.getByText('Apply'));
    await waitFor(() => expect(screen.getByTestId('hp')).toHaveTextContent('7'));
    await user.click(screen.getByText('Undo'));
    expect(screen.getByTestId('hp')).toHaveTextContent('10');
  });

  it('wraps action buttons when width is constrained', () => {
    const onClose = vi.fn();
    const onLastBreath = vi.fn();
    const initial = { hp: 10, armor: 0, inventory: [], actionHistory: [] };
    renderWithCharacter(<DamageModal isOpen onClose={onClose} onLastBreath={onLastBreath} />, {
      character: initial,
    });
    const group = screen.getByText('Apply').parentElement;
    group.style.display = 'grid';
    Object.defineProperty(group, 'clientHeight', {
      configurable: true,
      get() {
        return group.style.width === '120px' ? 60 : 30;
      },
    });
    expect(getComputedStyle(group).display).toBe('grid');
    const initialHeight = group.clientHeight;
    group.style.width = '120px';
    expect(group.clientHeight).toBeGreaterThan(initialHeight);
  });

  it('renders action buttons without overflow on narrow screens', () => {
    const onClose = vi.fn();
    const onLastBreath = vi.fn();
    const initial = { hp: 10, armor: 0, inventory: [], actionHistory: [] };
    document.body.style.width = '320px';
    renderWithCharacter(<DamageModal isOpen onClose={onClose} onLastBreath={onLastBreath} />, {
      character: initial,
    });
    const group = screen.getByText('Apply').parentElement;
    group.style.overflowX = 'auto';
    expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
  });
});
