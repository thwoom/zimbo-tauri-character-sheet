import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CharacterProvider } from './state/CharacterContext.jsx';
import { SettingsProvider } from './state/SettingsContext.jsx';
import { ThemeProvider } from './state/ThemeContext.jsx';

// Import CSS files in the correct order
import './styles/theme.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider initialAutoXpOnMiss={false} initialShowDiagnostics={false}>
        <CharacterProvider>
          <App />
        </CharacterProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
