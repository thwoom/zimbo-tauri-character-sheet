/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import StatusModal from './StatusModal.jsx';

describe('StatusModal', () => {
  it('handles status and debility toggles', async () => {
    const user = userEvent.setup();
    const onToggleStatusEffect = vi.fn();
    const onToggleDebility = vi.fn();
    const onClose = vi.fn();

    const statusEffectTypes = { poisoned: { name: 'Poisoned' } };
    const debilityTypes = { weak: { name: 'Weak' } };

    render(
      <StatusModal
        statusEffects={[]}
        debilities={[]}
        statusEffectTypes={statusEffectTypes}
        debilityTypes={debilityTypes}
        onToggleStatusEffect={onToggleStatusEffect}
        onToggleDebility={onToggleDebility}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByLabelText('Poisoned'));
    expect(onToggleStatusEffect).toHaveBeenCalledWith('poisoned');

    await user.click(screen.getByLabelText('Weak'));
    expect(onToggleDebility).toHaveBeenCalledWith('weak');

    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
