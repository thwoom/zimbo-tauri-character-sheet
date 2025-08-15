/* eslint-env jest */
import { renderHook, act, render } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { INITIAL_CHARACTER_DATA } from './character.js';
import { CharacterProvider, useCharacter } from './CharacterContext.jsx';

describe('CharacterContext', () => {
  const wrapper = ({ children }) => <CharacterProvider>{children}</CharacterProvider>;

  it('provides initial character data', () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    expect(result.current.character).toMatchObject(INITIAL_CHARACTER_DATA);
    expect(result.current.character.id).toBeDefined();
  });

  it('updates character state', () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    act(() => {
      result.current.setCharacter((prev) => ({ ...prev, hp: 20 }));
    });
    expect(result.current.character.hp).toBe(20);
  });

  it('adds and switches characters', () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    act(() => {
      result.current.addCharacter({ ...INITIAL_CHARACTER_DATA, hp: 5 });
    });
    expect(result.current.characters).toHaveLength(2);
    const newId = result.current.selectedId;
    expect(result.current.character.hp).toBe(5);
    act(() => {
      result.current.setSelectedId(result.current.characters[0].id);
    });
    expect(result.current.selectedId).not.toBe(newId);
    expect(result.current.character.hp).toBe(INITIAL_CHARACTER_DATA.hp);
  });

  it("doesn't re-render children when setCharacter is stable", () => {
    const childRender = vi.fn();
    const Child = () => {
      const { setCharacter } = useCharacter();
      void setCharacter;
      childRender();
      return null;
    };
    const MemoChild = React.memo(Child);

    const Parent = ({ count }) => (
      <>
        <CharacterProvider>
          <MemoChild />
        </CharacterProvider>
        <div>{count}</div>
      </>
    );

    const { rerender } = render(<Parent count={0} />);
    expect(childRender).toHaveBeenCalledTimes(1);
    rerender(<Parent count={1} />);
    expect(childRender).toHaveBeenCalledTimes(1);
  });
});
