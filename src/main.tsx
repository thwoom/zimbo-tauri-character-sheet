import './styles/global.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ArwesWrapper from './components/ArwesWrapper';
import DevPrimitivesPreview from './components/dev/DevPrimitivesPreview';
import ErrorBoundary from './components/ErrorBoundary';
import FxDemo from './components/FxDemo';
import { CharacterProvider } from './state/CharacterContext';
import { SettingsProvider } from './state/SettingsContext';
import { ThemeProvider } from './state/ThemeContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

console.log('Current pathname:', window.location.pathname);

if (import.meta.env.DEV && window.location.pathname === '/dev/components') {
  console.log('Rendering DevPrimitivesPreview');
  ReactDOM.createRoot(rootElement).render(
    <ThemeProvider>
      <ArwesWrapper>
        <DevPrimitivesPreview />
      </ArwesWrapper>
    </ThemeProvider>,
  );
} else if (window.location.pathname === '/fx-demo') {
  console.log('Rendering FxDemo');
  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <ThemeProvider>
        <ArwesWrapper>
          <FxDemo />
        </ArwesWrapper>
      </ThemeProvider>
    </ErrorBoundary>,
  );
} else {
  console.log('Rendering main App');
  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <ThemeProvider>
        <CharacterProvider>
          <SettingsProvider>
            <ArwesWrapper>
              <App />
            </ArwesWrapper>
          </SettingsProvider>
        </CharacterProvider>
      </ThemeProvider>
    </ErrorBoundary>,
  );
}
