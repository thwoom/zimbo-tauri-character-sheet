/* eslint-env jest */
import { renderHook, act, render, waitFor } from '@testing-library/react';
import React from 'react';
import { vi, afterEach } from 'vitest';
import { INITIAL_CHARACTER_DATA } from './character.js';
import { CharacterProvider, useCharacter } from './CharacterContext.jsx';

vi.mock('../utils/fileStorage.js', () => ({
  saveFile: vi.fn(() => Promise.resolve()),
  loadFile: vi.fn(() => Promise.resolve(null)),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('CharacterContext', () => {
  const wrapper = ({ children }) => <CharacterProvider>{children}</CharacterProvider>;

  it('provides initial character data', async () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    await waitFor(() => {});
    expect(result.current.character).toMatchObject(INITIAL_CHARACTER_DATA);
  });

  it('updates character state', async () => {
    const { result } = renderHook(() => useCharacter(), { wrapper });
    await waitFor(() => {});
    act(() => {
      result.current.setCharacter((prev) => ({ ...prev, hp: 20 }));
    });
    expect(result.current.character.hp).toBe(20);
  });

  it("doesn't re-render children when setCharacter is stable", async () => {
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
    await waitFor(() => {});
    expect(childRender).toHaveBeenCalledTimes(2);
    rerender(<Parent count={1} />);
    await waitFor(() => {});
    expect(childRender).toHaveBeenCalledTimes(2);
  });

  it('loads saved character on mount', async () => {
    const saved = { ...INITIAL_CHARACTER_DATA, hp: 5 };
    const { loadFile } = await import('../utils/fileStorage.js');
    loadFile.mockResolvedValueOnce(JSON.stringify(saved));

    const { result } = renderHook(() => useCharacter(), { wrapper });
    await waitFor(() => {});
    await waitFor(() => expect(result.current.character).toEqual(saved));
    expect(loadFile).toHaveBeenCalledWith('character.json');
  });

  it('saves character to disk when it changes', async () => {
    const { loadFile, saveFile } = await import('../utils/fileStorage.js');
    loadFile.mockRejectedValueOnce(new Error('missing'));

    const { result } = renderHook(() => useCharacter(), { wrapper });
    await waitFor(() => {});
    await waitFor(() => expect(loadFile).toHaveBeenCalled());

    act(() => {
      result.current.setCharacter((prev) => ({ ...prev, hp: 42 }));
    });

    await waitFor(() => {
      expect(saveFile).toHaveBeenCalledWith(
        'character.json',
        JSON.stringify({ ...INITIAL_CHARACTER_DATA, hp: 42 }),
      );
    });
  });
  it('falls back to a default character on invalid JSON', async () => {
    const { loadFile } = await import('../utils/fileStorage.js');
    loadFile.mockResolvedValueOnce('not json');

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useCharacter(), { wrapper });
    await waitFor(() => {});
    await waitFor(() => expect(result.current.character).toMatchObject(INITIAL_CHARACTER_DATA));
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
  it('creates a default character when loading fails', async () => {
    const { loadFile } = await import('../utils/fileStorage.js');
    loadFile.mockRejectedValueOnce(new Error('missing'));

    const { result } = renderHook(() => useCharacter(), { wrapper });
    await waitFor(() => {});
    await waitFor(() => expect(result.current.character).toMatchObject(INITIAL_CHARACTER_DATA));
    expect(loadFile).toHaveBeenCalledWith('character.json');
  });
});
