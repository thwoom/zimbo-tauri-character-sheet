import styles from './StatsPanel.module.css';

const StatsPanel = ({ character, setCharacter, saveToHistory, getTotalArmor, setShowLevelUpModal }) => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>⚡ Stats &amp; Health</h3>
      <div className={styles.statsGrid}>
        {Object.entries(character.stats).map(([stat, data]) => (
          <div key={stat} className={styles.statItem}>
            <div className={styles.statName}>{stat}</div>
            <div className={styles.statValue}>
              {data.score} ({data.mod >= 0 ? '+' : ''}{data.mod})
            </div>
          </div>
        ))}
      </div>
      <div className={styles.barContainer}>
        <div
          className={styles.bar}
          style={{
            background: 'linear-gradient(90deg, #ff4444, #ffaa44)',
            width: `${(character.hp / character.maxHp) * 100}%`,
          }}
        />
      </div>
      <div className={styles.centerText}>
        HP: {character.hp}/{character.maxHp} | Armor: {getTotalArmor()}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 1) }));
          }}
        >
          +1 HP
        </button>
        <button
          className={`${styles.button} ${styles.danger}`}
          onClick={() => {
            saveToHistory('HP Change');
            setCharacter(prev => ({ ...prev, hp: Math.max(0, prev.hp - 1) }));
          }}
        >
          -1 HP
        </button>
      </div>
      <div className={styles.xpBarContainer}>
        <div
          className={styles.bar}
          style={{
            background: 'linear-gradient(90deg, #4a90ff, #00ff88)',
            width: `${(character.xp / character.xpNeeded) * 100}%`,
          }}
        />
      </div>
      <div className={styles.centerText}>
        XP: {character.xp}/{character.xpNeeded} (Level {character.level})
      </div>
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={() => setCharacter(prev => ({ ...prev, xp: prev.xp + 1 }))}
        >
          +1 XP
        </button>
        <button
          className={`${styles.button} ${styles.danger}`}
          onClick={() => setCharacter(prev => ({ ...prev, xp: Math.max(0, prev.xp - 1) }))}
        >
          -1 XP
        </button>
      </div>
      {character.xp >= character.xpNeeded && (
        <button
          className={`${styles.button} ${styles.levelUp}`}
          onClick={() => setShowLevelUpModal(true)}
        >
          🎉 LEVEL UP AVAILABLE!
        </button>
      )}
    </div>
  );
};

export default StatsPanel;
