import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { CharacterProvider } from './state/CharacterContext';
import { SettingsProvider } from './state/SettingsContext';
import { ThemeProvider } from './state/ThemeContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <CharacterProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </CharacterProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
