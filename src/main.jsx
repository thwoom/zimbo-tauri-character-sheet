import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CharacterProvider } from './state/CharacterContext.jsx';
import { ThemeProvider } from './state/ThemeContext.jsx';
import { SettingsProvider } from './state/SettingsContext.jsx';

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
