/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import InventoryModal from './InventoryModal.jsx';

describe('InventoryModal', () => {
  it('shows message when inventory is empty', () => {
    render(
      <InventoryModal
        inventory={[]}
        onEquip={() => {}}
        onConsume={() => {}}
        onDrop={() => {}}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('calls handlers on user actions', async () => {
    const user = userEvent.setup();
    const onEquip = vi.fn();
    const onConsume = vi.fn();
    const onDrop = vi.fn();
    const onClose = vi.fn();

    const inventory = [
      { id: 1, name: 'Sword', type: 'weapon', equipped: false },
      { id: 2, name: 'Potion', type: 'consumable', quantity: 1 },
    ];

    render(
      <InventoryModal
        inventory={inventory}
        onEquip={onEquip}
        onConsume={onConsume}
        onDrop={onDrop}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByText('Equip'));
    expect(onEquip).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('Consume'));
    expect(onConsume).toHaveBeenCalledWith(2);

    const dropButtons = screen.getAllByText('Drop');
    await user.click(dropButtons[0]);
    expect(onDrop).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
