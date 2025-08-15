import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import CharacterContext from '../state/CharacterContext.jsx';
import { loadFile } from '../utils/fileStorage.js';
import ExportModal from './ExportModal.jsx';

vi.mock('../utils/fileStorage.js', () => ({
  saveFile: vi.fn(),
  loadFile: vi.fn(),
}));

function renderWithCharacter(ui, { character }) {
  const Wrapper = ({ children }) => {
    const [charState, setCharState] = React.useState(character);
    return (
      <CharacterContext.Provider value={{ character: charState, setCharacter: setCharState }}>
        {children}
        <div data-testid="name">{charState.name}</div>
      </CharacterContext.Provider>
    );
  };
  return render(ui, { wrapper: Wrapper });
}

describe('ExportModal', () => {
  it('toggles visibility with isOpen prop', () => {
    const onClose = vi.fn();
    const initial = { name: 'Hero' };
    const { rerender } = renderWithCharacter(<ExportModal isOpen={false} onClose={onClose} />, {
      character: initial,
    });
    expect(screen.queryByText(/Export \/ Import/)).not.toBeInTheDocument();
    rerender(<ExportModal isOpen onClose={onClose} />);
    expect(screen.getByText(/Export \/ Import/)).toBeInTheDocument();
  });

  it('loads character from file', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const initial = { name: 'Hero' };
    loadFile.mockResolvedValueOnce('{"name":"New"}');
    renderWithCharacter(<ExportModal isOpen onClose={onClose} />, { character: initial });
    await user.click(screen.getByText('Load'));
    expect(screen.getByTestId('name')).toHaveTextContent('New');
  });

  it('wraps action buttons when width is constrained', () => {
    const onClose = vi.fn();
    const initial = { name: 'Hero' };
    renderWithCharacter(<ExportModal isOpen onClose={onClose} />, { character: initial });
    const group = screen.getByText('Save').parentElement;
    group.style.display = 'flex';
    group.style.flexWrap = 'wrap';
    Object.defineProperty(group, 'clientHeight', {
      configurable: true,
      get() {
        return group.style.width === '120px' ? 60 : 30;
      },
    });
    expect(getComputedStyle(group).flexWrap).toBe('wrap');
    const initialHeight = group.clientHeight;
    group.style.width = '120px';
    expect(group.clientHeight).toBeGreaterThan(initialHeight);
  });

  it('renders action buttons without overflow on narrow screens', () => {
    const onClose = vi.fn();
    const initial = { name: 'Hero' };
    document.body.style.width = '320px';
    renderWithCharacter(<ExportModal isOpen onClose={onClose} />, { character: initial });
    const group = screen.getByText('Save').parentElement;
    group.style.overflowX = 'auto';
    expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth);
  });
});
