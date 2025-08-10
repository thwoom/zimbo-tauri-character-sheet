import styles from './MoveList.module.css';

const MoveList = ({ character, rollDice, getEquippedWeaponDamage, rollResult, rollHistory }) => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>🎲 Dice Roller</h3>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Stat Checks</h4>
        <div className={styles.grid3}>
          {Object.entries(character.stats).map(([stat, data]) => (
            <button
              key={stat}
              className={styles.button}
              style={{ background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)', padding: '8px 6px', margin: '2px', fontSize: '11px' }}
              onClick={() => rollDice(`2d6+${data.mod}`, `${stat} Check`)}
            >
              {stat} ({data.mod >= 0 ? '+' : ''}{data.mod})
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Combat Rolls</h4>
        <div className={styles.grid2}>
          <button
            className={styles.button}
            style={{ background: 'linear-gradient(45deg, #ef4444, #dc2626)', margin: '2px', fontSize: '11px' }}
            onClick={() => rollDice(getEquippedWeaponDamage(), 'Weapon Damage')}
          >
            Weapon ({getEquippedWeaponDamage()})
          </button>
          <button
            className={styles.button}
            style={{ background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)', margin: '2px', fontSize: '11px' }}
            onClick={() => rollDice('2d6+3', 'Hack & Slash')}
          >
            Hack & Slash
          </button>
          <button
            className={styles.button}
            style={{ background: 'linear-gradient(45deg, #f97316, #ea580c)', margin: '2px', fontSize: '11px' }}
            onClick={() => rollDice('d4', 'Upper Hand')}
          >
            Upper Hand d4
          </button>
          <button
            className={styles.button}
            style={{ background: 'linear-gradient(45deg, #eab308, #d97706)', margin: '2px', fontSize: '11px' }}
            onClick={() => rollDice('2d6-1', 'Taunt')}
          >
            Taunt Enemy
          </button>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Basic Dice</h4>
        <div className={styles.grid6}>
          {[4, 6, 8, 10, 12, 20].map(sides => (
            <button
              key={sides}
              className={styles.button}
              style={{ background: 'linear-gradient(45deg, #06b6d4, #0891b2)', padding: '8px 4px', margin: '2px', fontSize: '11px' }}
              onClick={() => rollDice(`d${sides}`)}
            >
              d{sides}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.rollResult}>{rollResult}</div>
      {rollHistory.length > 0 && (
        <div className={styles.history}>
          <div className={styles.historyTitle}>Recent Rolls:</div>
          {rollHistory.slice(0, 3).map((roll, index) => (
            <div key={index} className={styles.historyItem}>
              <span className={styles.historyTimestamp}>{roll.timestamp}</span> - {roll.result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveList;
