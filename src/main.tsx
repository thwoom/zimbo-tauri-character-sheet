import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CharacterProvider } from './state/CharacterContext';
import { SettingsProvider } from './state/SettingsContext';
import { ThemeProvider } from './state/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CharacterProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </CharacterProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
