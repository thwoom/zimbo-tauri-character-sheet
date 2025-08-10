/* eslint-env jest */
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { INITIAL_CHARACTER_DATA } from './character.js';
import { CharacterProvider, useCharacter } from './CharacterContext.jsx';

describe('CharacterContext', () => {
  const wrapper = ({ children }) => <CharacterProvider>{children}</CharacterProvider>;

  it('provides initial character data', () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    expect(result.current.character).toEqual(INITIAL_CHARACTER_DATA);
  });

  it('updates character state', () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    act(() => {
      result.current.setCharacter((prev) => ({ ...prev, hp: 20 }));
    });
    expect(result.current.character.hp).toBe(20);
  });
});
