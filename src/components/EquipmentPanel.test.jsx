import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import EquipmentPanel from './EquipmentPanel.jsx';

function setup() {
  const setCharacter = vi.fn();
  const character = {
    inventory: [{ id: 1, name: 'Helmet', slot: 'Head', equipped: true, weight: 1 }],
  };
  render(<EquipmentPanel character={character} setCharacter={setCharacter} />);
  return { setCharacter };
}

describe('EquipmentPanel', () => {
  it('shows equipped items by slot', () => {
    setup();
    expect(screen.getByText('Helmet')).toBeInTheDocument();
  });

  it('unequips item when button clicked', async () => {
    const user = userEvent.setup();
    const { setCharacter } = setup();
    await user.click(screen.getByLabelText('Unequip Helmet'));
    expect(setCharacter).toHaveBeenCalled();
  });
});
