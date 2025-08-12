import PropTypes from 'prop-types';
import useInventory from '../hooks/useInventory';
import { debilityTypes } from '../state/character';
import styles from './InventoryPanel.module.css';

const InventoryPanel = ({ character, setCharacter, rollDie, setRollResult }) => {
  const { handleConsumeItem } = useInventory(character, setCharacter);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>🎒 Equipment</h3>
      <div className={styles.items}>
        {character.inventory.slice(0, 5).map((item) => (
          <div key={item.id} className={`${styles.item} ${item.equipped ? styles.equipped : ''}`}>
            <div className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>
                  {item.type === 'weapon' && '⚔️'}
                  {item.type === 'magic' && '💍'}
                  {item.type === 'consumable' && '🧪'}
                  {item.type === 'armor' && '🛡️'}
                  {item.type === 'material' && '📦'}
                  {(!item.type || item.type === 'gear') && '🎒'}
                  {item.name}
                  {item.equipped && <span className={styles.equippedMark}>✓</span>}
                  {item.description && (
                    <div className={styles.itemDescription}>{item.description}</div>
                  )}
                </div>
                <div className={styles.itemDetails}>
                  {item.damage && `${item.damage} damage`}
                  {item.armor && `+${item.armor} armor`}
                  {item.quantity > 1 && ` x${item.quantity}`}
                </div>
              </div>
              {item.type === 'consumable' && item.quantity > 0 && (
                <button
                  className={styles.useButton}
                  onClick={() => {
                    if (item.name === 'Healing Potion') {
                      const healing = rollDie(8);
                      setRollResult(`Used ${item.name}: healed ${healing} HP!`);
                      handleConsumeItem(item.id, (char) => ({
                        ...char,
                        hp: Math.min(char.maxHp, char.hp + healing),
                      }));
                    } else {
                      handleConsumeItem(item.id);
                    }
                  }}
                >
                  Use
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {character.debilities.length > 0 && (
        <div className={styles.debilitiesSection}>
          <div className={styles.debilitiesTitle}>Active Debilities:</div>
          <div className={styles.debilitiesList}>
            {character.debilities.map((debility) => (
              <span key={debility} className={styles.debilityTag}>
                {debilityTypes[debility].icon} {debilityTypes[debility].name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

InventoryPanel.propTypes = {
  character: PropTypes.object.isRequired,
  setCharacter: PropTypes.func.isRequired,
  rollDie: PropTypes.func.isRequired,
  setRollResult: PropTypes.func.isRequired,
};

export default InventoryPanel;
