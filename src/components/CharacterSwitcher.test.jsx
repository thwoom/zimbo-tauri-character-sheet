import { render, screen } from '@testing-library/react';
import React from 'react';
import { CharacterProvider } from '../state/CharacterContext';
import CharacterSwitcher from './CharacterSwitcher';

describe('CharacterSwitcher', () => {
  it('renders nothing when character list is absent', () => {
    render(
      <CharacterProvider>
        <CharacterSwitcher />
      </CharacterProvider>,
    );
    expect(screen.queryByLabelText('Select character')).toBeNull();
  });
});
