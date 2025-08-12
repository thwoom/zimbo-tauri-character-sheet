import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CharacterProvider } from './state/CharacterContext.jsx';
import { ThemeProvider } from './state/ThemeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CharacterProvider>
        <App />
      </CharacterProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
