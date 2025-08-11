import { panelStyle, buttonStyle } from './styles.js';

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginBottom: '15px',
};

const statItemStyle = {
  textAlign: 'center',
  background: 'rgba(0, 0, 0, 0.3)',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid rgba(0, 255, 136, 0.3)',
};

const statNameStyle = { fontSize: '0.8rem', color: '#aaa' };

const statValueStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#00ff88',
};

const barContainerStyle = {
  width: '100%',
  height: '25px',
  background: '#333',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '2px solid #555',
  margin: '10px 0',
};

const xpBarContainerStyle = {
  width: '100%',
  height: '20px',
  background: '#333',
  borderRadius: '10px',
  overflow: 'hidden',
  margin: '15px 0 10px 0',
};

const centerTextStyle = { textAlign: 'center', fontWeight: 'bold' };

const controlsStyle = { textAlign: 'center', marginTop: '10px' };

const autoXpLabelStyle = { display: 'block', textAlign: 'center', marginTop: '10px' };

const resourceRowStyle = { marginBottom: '10px' };

const resourceHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '5px',
};

const resourceLabelStyle = { fontWeight: 'bold', fontSize: '0.9rem' };

const resourceButtonsStyle = { display: 'flex', gap: '5px' };

const minusButtonStyle = {
  ...buttonStyle,
  background: 'linear-gradient(45deg, #ef4444, #dc2626)',
  padding: '5px 10px',
  margin: '0',
  fontSize: '12px',
  flex: '1',
};

const plusButtonStyle = {
  ...buttonStyle,
  padding: '5px 10px',
  margin: '0',
  fontSize: '12px',
  flex: '1',
};

const chronoButtonStyle = (disabled) => ({
  ...buttonStyle,
  width: '100%',
  background: disabled
    ? 'linear-gradient(45deg, #6b7280, #374151)'
    : 'linear-gradient(45deg, #10b981, #059669)',
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
});

const warningBoxStyle = {
  background: 'rgba(251, 191, 36, 0.2)',
  border: '1px solid #fbbf24',
  borderRadius: '6px',
  padding: '10px',
  textAlign: 'center',
  marginTop: '10px',
};

const warningTextStyle = {
  color: '#fbbf24',
  fontSize: '0.8rem',
  fontWeight: 'bold',
};

const resetButtonStyle = {
  ...buttonStyle,
  width: '100%',
  marginTop: '15px',
  background: 'linear-gradient(45deg, #4a90ff, #00ff88)',
  padding: '10px 20px',
};

const CharacterStats = ({
  character,
  setCharacter,
  saveToHistory,
  getTotalArmor,
  setShowLevelUpModal,
  autoXpOnMiss,
  setAutoXpOnMiss,
  setRollResult,
  setSessionNotes,
  clearRollHistory,
}) => {
  return (
    <div style={panelStyle}>
      <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '1.3rem' }}>
        ⚡ Stats &amp; Health
      </h3>
      <div style={statsGridStyle}>
        {Object.entries(character.stats).map(([stat, data]) => (
          <div key={stat} style={statItemStyle}>
            <div style={statNameStyle}>{stat}</div>
            <div style={statValueStyle}>
              {data.score} ({data.mod >= 0 ? '+' : ''}
              {data.mod})
            </div>
          </div>
        ))}
      </div>
      <div style={barContainerStyle}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #ff4444, #ffaa44)',
            width: `${(character.hp / character.maxHp) * 100}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={centerTextStyle}>
        HP: {character.hp}/{character.maxHp} | Armor: {getTotalArmor()}
      </div>
      <div style={controlsStyle}>
        <button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.min(prev.maxHp, prev.hp + 1),
            }));
          }}
          style={buttonStyle}
        >
          +1 HP
        </button>
        <button
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter((prev) => ({
              ...prev,
              hp: Math.max(0, prev.hp - 1),
            }));
          }}
          style={{ ...buttonStyle, background: 'linear-gradient(45deg, #ef4444, #dc2626)' }}
        >
          -1 HP
        </button>
      </div>
      <div style={xpBarContainerStyle}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #4a90ff, #00ff88)',
            width: `${(character.xp / character.xpNeeded) * 100}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={centerTextStyle}>
        XP: {character.xp}/{character.xpNeeded} (Level {character.level})
      </div>
      <div style={controlsStyle}>
        <button
          onClick={() => setCharacter((prev) => ({ ...prev, xp: prev.xp + 1 }))}
          style={buttonStyle}
        >
          +1 XP
        </button>
        <button
          onClick={() => setCharacter((prev) => ({ ...prev, xp: Math.max(0, prev.xp - 1) }))}
          style={{ ...buttonStyle, background: 'linear-gradient(45deg, #ef4444, #dc2626)' }}
        >
          -1 XP
        </button>
      </div>
      <label style={autoXpLabelStyle}>
        <input
          type="checkbox"
          checked={autoXpOnMiss}
          onChange={() => setAutoXpOnMiss((prev) => !prev)}
        />{' '}
        Auto XP on Miss
      </label>
      {character.xp >= character.xpNeeded && (
        <button
          onClick={() => setShowLevelUpModal(true)}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            width: '100%',
            marginTop: '15px',
            padding: '15px',
            fontSize: '16px',
            animation: 'pulse 2s infinite',
          }}
        >
          🎉 LEVEL UP AVAILABLE!
        </button>
      )}
      <div style={{ marginTop: '15px' }}>
        <div style={centerTextStyle}>Chrono-Retcon Uses: {character.resources.chronoUses}</div>
        <button
          onClick={() => {
            if (character.resources.chronoUses > 0) {
              setCharacter((prev) => ({
                ...prev,
                resources: {
                  ...prev.resources,
                  chronoUses: prev.resources.chronoUses - 1,
                },
              }));
              setRollResult('⏰ Chrono-Retcon activated - rewrite any recent action!');
              setTimeout(() => setRollResult('Ready to roll!'), 3000);
            } else {
              setRollResult('❌ No uses remaining!');
              setTimeout(() => setRollResult('Ready to roll!'), 2000);
            }
          }}
          disabled={character.resources.chronoUses === 0}
          style={chronoButtonStyle(character.resources.chronoUses === 0)}
          title="Rewrite any recent action retroactively. Examples: 'Actually, I dodged that attack' or 'I already searched this room'"
        >
          ⏰ Use Chrono-Retcon
        </button>
      </div>
      {[
        { key: 'paradoxPoints', label: 'Paradox Points', max: 3, color: '#fbbf24' },
        { key: 'bandages', label: 'Bandages', max: 3, color: '#8b5cf6' },
        { key: 'rations', label: 'Rations', max: 5, color: '#f97316' },
        { key: 'advGear', label: 'Adventuring Gear', max: 5, color: '#06b6d4' },
      ].map(({ key, label, max, color }) => (
        <div key={key} style={resourceRowStyle}>
          <div style={resourceHeaderStyle}>
            <span style={resourceLabelStyle}>{label}:</span>
            <span style={{ color, fontWeight: 'bold' }}>
              {character.resources[key]}/{max}
            </span>
          </div>
          <div style={resourceButtonsStyle}>
            <button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.max(0, prev.resources[key] - 1),
                  },
                }))
              }
              style={minusButtonStyle}
            >
              -1
            </button>
            <button
              onClick={() =>
                setCharacter((prev) => ({
                  ...prev,
                  resources: {
                    ...prev.resources,
                    [key]: Math.min(max, prev.resources[key] + 1),
                  },
                }))
              }
              style={plusButtonStyle}
            >
              +1
            </button>
          </div>
        </div>
      ))}
      {character.resources.paradoxPoints >= 3 && (
        <div style={warningBoxStyle}>
          <div style={warningTextStyle}>⚠️ REALITY UNSTABLE! ⚠️</div>
        </div>
      )}
      <button
        onClick={() => {
          setCharacter((prev) => ({
            ...prev,
            resources: {
              chronoUses: 2,
              paradoxPoints: 0,
              bandages: 3,
              rations: 5,
              advGear: 5,
            },
          }));
          setSessionNotes('');
          clearRollHistory();
          setRollResult('🔄 All resources restored!');
        }}
        style={resetButtonStyle}
      >
        🔄 Reset All Resources
      </button>
    </div>
  );
};

export default CharacterStats;
