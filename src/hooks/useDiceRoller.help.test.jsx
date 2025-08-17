import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { SettingsProvider } from '../state/SettingsContext';
import useDiceRoller from './useDiceRoller.js';

const aidModal = {
  isOpen: false,
  open: vi.fn(() => {
    aidModal.isOpen = true;
  }),
  close: vi.fn(() => {
    aidModal.isOpen = false;
  }),
};
const rollModal = {
  isOpen: false,
  open: vi.fn(),
  close: vi.fn(),
};
let modalCallCount = 0;
vi.mock('./useModal', () => {
  return {
    default: () => {
      modalCallCount += 1;
      return modalCallCount === 1 ? rollModal : aidModal;
    },
  };
});

const wrapper = ({ children }) => (
  <SettingsProvider initialAutoXpOnMiss={false}>{children}</SettingsProvider>
);

describe('useDiceRoller help modal cleanup', () => {
  const baseCharacter = { statusEffects: [], debilities: [], xp: 0 };

  it('closes aid modal and resolves pending promise on unmount', async () => {
    const setCharacter = () => {};
    const { result, unmount } = renderHook(() => useDiceRoller(baseCharacter, setCharacter), {
      wrapper,
    });

    let rollPromise;
    act(() => {
      rollPromise = result.current.rollDice('2d6', 'test');
    });

    expect(aidModal.isOpen).toBe(true);

    act(() => {
      unmount();
    });

    await rollPromise;

    expect(aidModal.close).toHaveBeenCalledTimes(1);
    expect(aidModal.isOpen).toBe(false);
  });
});
