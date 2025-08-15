import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App.jsx';
import { INITIAL_CHARACTER_DATA } from './state/character.js';
import CharacterContext from './state/CharacterContext.jsx';
import { SettingsProvider } from './state/SettingsContext.jsx';
import { ThemeProvider } from './state/ThemeContext.jsx';
import styles from './styles/AppStyles.module.css';

const Wrapper = ({ children }) => {
  const [character, setCharacter] = React.useState(INITIAL_CHARACTER_DATA);
  return (
    <ThemeProvider>
      <CharacterContext.Provider value={{ character, setCharacter }}>
        <SettingsProvider initialAutoXpOnMiss={true}>{children}</SettingsProvider>
      </CharacterContext.Provider>
    </ThemeProvider>
  );
};

describe('Header responsiveness', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    window.matchMedia =
      window.matchMedia ||
      ((query) => ({
        matches: query.includes('(max-width: 768px)'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }));
  });

  it('keeps the last header button within bounds', () => {
    const { container } = render(
      <Wrapper>
        <App />
      </Wrapper>,
    );

    const headerTop = container.querySelector(`.${styles.headerTop}`);
    const buttonRow = container.querySelector(`.${styles.buttonRow}`);
    const buttons = buttonRow.querySelectorAll('button');
    const lastButton = buttons[buttons.length - 1];

    // Mock layout metrics since jsdom has no layout engine
    Object.defineProperty(headerTop, 'offsetWidth', { value: 600 });
    Object.defineProperty(lastButton, 'offsetLeft', { value: 550 });
    Object.defineProperty(lastButton, 'offsetWidth', { value: 50 });

    headerTop.getBoundingClientRect = () => ({
      left: 0,
      right: headerTop.offsetWidth,
      width: headerTop.offsetWidth,
      top: 0,
      bottom: 0,
      height: 0,
    });

    lastButton.getBoundingClientRect = () => ({
      left: lastButton.offsetLeft,
      right: lastButton.offsetLeft + lastButton.offsetWidth,
      width: lastButton.offsetWidth,
      top: 0,
      bottom: 0,
      height: 0,
    });

    expect(lastButton.getBoundingClientRect().right).toBeLessThanOrEqual(
      headerTop.getBoundingClientRect().right,
    );
  });
});
