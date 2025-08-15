import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { INITIAL_CHARACTER_DATA } from '../state/character.js';
import { CharacterProvider, useCharacter } from '../state/CharacterContext.jsx';
import CharacterSwitcher from './CharacterSwitcher.jsx';

describe('CharacterSwitcher', () => {
  it('switches characters via select', async () => {
    const user = userEvent.setup();
    function AddCharacter() {
      const { addCharacter } = useCharacter();
      React.useEffect(() => {
        addCharacter({ ...INITIAL_CHARACTER_DATA, hp: 5 });
      }, [addCharacter]);
      return null;
    }
    function ShowHp() {
      const { character } = useCharacter();
      return <div data-testid="hp">{character.hp}</div>;
    }
    render(
      <CharacterProvider>
        <AddCharacter />
        <CharacterSwitcher />
        <ShowHp />
      </CharacterProvider>,
    );
    const select = screen.getByLabelText('Select character');
    expect(select.options).toHaveLength(2);
    await user.selectOptions(select, select.options[1]);
    expect(screen.getByTestId('hp')).toHaveTextContent('5');
  });
});
