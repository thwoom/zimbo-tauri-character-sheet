/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import StatusModal from './StatusModal.jsx';

function StatusWrapper({ isOpen, ...props }) {
  return isOpen ? <StatusModal {...props} /> : null;
}

describe('StatusModal', () => {
  it('toggles visibility via conditional rendering', () => {
    const props = {
      statusEffects: [],
      debilities: [],
      statusEffectTypes: {},
      debilityTypes: {},
      onToggleStatusEffect: () => {},
      onToggleDebility: () => {},
      onClose: () => {},
    };
    const { rerender } = render(<StatusWrapper isOpen={false} {...props} />);
    expect(screen.queryByText(/Status & Debilities/)).not.toBeInTheDocument();
    rerender(<StatusWrapper isOpen {...props} />);
    expect(screen.getByText(/Status & Debilities/)).toBeInTheDocument();
  });

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
