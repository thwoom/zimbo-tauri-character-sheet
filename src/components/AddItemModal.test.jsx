import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import AddItemModal from './AddItemModal';

describe('AddItemModal', () => {
  it('generates options and saves selected item', async () => {
    const user = userEvent.setup();
    const generateOptions = vi
      .fn()
      .mockResolvedValue([
        { name: 'Sword', type: 'weapon', flavor: 'A sharp blade', effect: '+1 dmg' },
      ]);
    const onAdd = vi.fn();
    render(<AddItemModal onAdd={onAdd} onClose={() => {}} generateOptions={generateOptions} />);

    await user.click(screen.getByText(/generate with ai/i));
    expect(generateOptions).toHaveBeenCalled();

    const option = await screen.findByText('A sharp blade');
    await user.click(option);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Sword');

    await user.click(screen.getByText(/save/i));
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Sword',
        type: 'weapon',
        description: 'A sharp blade',
        effect: '+1 dmg',
      }),
    );
  });

  it('copies prompt', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    render(<AddItemModal onAdd={() => {}} onClose={() => {}} />);

    await user.type(screen.getByLabelText(/name/i), 'Dagger');
    await user.click(screen.getByText(/copy prompt/i));
    expect(writeText).toHaveBeenCalled();
  });
});
