import { useSettings } from '../state/SettingsContext';
import { useTheme } from '../state/ThemeContext';
import { useSimpleCharacter } from './SimpleCharacterContext';

const MinimalTest = () => {
  const { character } = useSimpleCharacter();
  const { showDiagnostics } = useSettings();
  const { theme } = useTheme();

  console.log('MinimalTest: Rendering...');
  console.log('MinimalTest: Theme:', theme);
  console.log('MinimalTest: Character level:', character?.level);

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#0b0d17',
        color: '#d0d7e2',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#64f1e1', marginBottom: '20px' }}>Minimal Test - Working!</h1>
      <p>If you can see this, the basic React setup is working.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <p>Theme: {theme}</p>
      <p>Diagnostics: {showDiagnostics ? 'ON' : 'OFF'}</p>
      <p>Character Level: {character?.level || 'Loading...'}</p>
      <p>
        Character HP: {character?.hp || 'Loading...'}/{character?.maxHp || 'Loading...'}
      </p>
    </div>
  );
};

export default MinimalTest;
