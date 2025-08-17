/* eslint-env jest */
import { render, screen, act, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StatusTray from './StatusTray';

vi.useFakeTimers();

const baseNow = Date.now();
vi.setSystemTime(baseNow);

const effects = [
  {
    id: '1',
    type: 'poisoned',
    stacks: 2,
    expiresAt: baseNow + 3000,
    priority: 1,
  },
  {
    id: '2',
    type: 'burning',
    stacks: 1,
    expiresAt: baseNow + 5000,
    priority: 2,
  },
];

test('orders effects by priority and handles clicks', () => {
  const onEffectClick = vi.fn();
  render(<StatusTray statusEffects={effects} onEffectClick={onEffectClick} />);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0]).toHaveAccessibleName('Burning');
  expect(buttons[1]).toHaveAccessibleName('Poisoned');

  fireEvent.click(buttons[0]);
  expect(onEffectClick).toHaveBeenCalledWith('2');
});

test('updates countdown over time', () => {
  render(<StatusTray statusEffects={effects} onEffectClick={() => {}} />);
  const burning = screen.getByLabelText('Burning');
  const initial = burning.textContent;
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(burning.textContent).not.toBe(initial);
});
