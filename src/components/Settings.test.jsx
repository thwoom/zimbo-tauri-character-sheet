/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import ThemeContext from '../state/ThemeContext.jsx';
import SettingsContext from '../state/SettingsContext.jsx';
import Settings from './Settings.jsx';

describe('Settings', () => {
  it('updates theme and auto XP on miss setting', async () => {
    const user = userEvent.setup();
    const setTheme = vi.fn();
    const setAutoXpOnMiss = vi.fn();

    render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme, themes: ['light', 'dark'] }}>
        <SettingsContext.Provider value={{ autoXpOnMiss: false, setAutoXpOnMiss }}>
          <Settings />
        </SettingsContext.Provider>
      </ThemeContext.Provider>,
    );

    await user.selectOptions(screen.getByLabelText(/Theme:/i), 'dark');
    expect(setTheme).toHaveBeenCalledWith('dark');

    await user.click(screen.getByLabelText(/Auto XP on miss/i));
    expect(setAutoXpOnMiss).toHaveBeenCalledWith(true);
  });
});
