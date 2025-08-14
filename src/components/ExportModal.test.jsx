/* eslint-env jest */
import { invoke } from '@tauri-apps/api/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import CharacterContext from '../state/CharacterContext.jsx';
import ExportModal from './ExportModal.jsx';

vi.mock('@tauri-apps/api/core', () => ({ invoke: vi.fn() }));

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
    invoke.mockResolvedValueOnce('{"name":"New"}');
    renderWithCharacter(<ExportModal isOpen onClose={onClose} />, { character: initial });
    await user.click(screen.getByText('Load'));
    expect(screen.getByTestId('name')).toHaveTextContent('New');
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

  it('includes responsive styles for button group', () => {
    const css = fs.readFileSync(path.resolve(__dirname, './ExportModal.module.css'), 'utf8');
    expect(css).toMatch(/\.buttonGroup[^}]*width:\s*100%/);
    expect(css).toMatch(
      /@media\s*\(max-width:\s*360px\)\s*{[^}]*\.buttonGroup[^}]*flex-direction:\s*column/,
    );
  });
});
