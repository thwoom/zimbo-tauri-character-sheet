import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaBook, FaHandHoldingHeart, FaPaw, FaShieldHalved, FaXmark } from 'react-icons/fa6';
import { getClass } from '../data/classes';
import { backdropVariants, modalVariants } from '../motion/variants';
import styles from './ClassMechanicsModal.module.css';

const ClassMechanicsModal = ({ isOpen, onClose, character, setCharacter }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const classData = getClass(character.class);

  if (!isOpen || !classData) return null;

  const handleUpdateCharacter = (updates) => {
    setCharacter((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const renderWizardMechanics = () => (
    <div className={styles.mechanicsSection}>
      <h3 className={styles.sectionTitle}>
        <FaBook className={styles.sectionIcon} />
        Spellbook
      </h3>

      <div className={styles.spellSlots}>
        <h4>Spell Slots</h4>
        <div className={styles.slotGrid}>
          {Object.entries(classData.mechanics.spellSlots || {}).map(([level, slots]) => (
            <div key={level} className={styles.slotItem}>
              <span className={styles.slotLevel}>Level {level}</span>
              <span className={styles.slotCount}>{slots} slots</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.spellLists}>
        <div className={styles.spellList}>
          <h4>Cantrips (Always Available)</h4>
          <ul className={styles.spellList}>
            {(classData.mechanics.cantrips || []).map((spell) => (
              <li key={spell} className={styles.spellItem}>
                {spell}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.spellList}>
          <h4>Known Spells</h4>
          <ul className={styles.spellList}>
            {(classData.mechanics.startingSpells || []).map((spell) => (
              <li key={spell} className={styles.spellItem}>
                {spell}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderFighterMechanics = () => (
    <div className={styles.mechanicsSection}>
      <h3 className={styles.sectionTitle}>
        <FaShieldHalved className={styles.sectionIcon} />
        Signature Weapon
      </h3>

      <div className={styles.signatureWeapon}>
        <h4>Weapon Options</h4>
        <div className={styles.optionGrid}>
          {(classData.mechanics.signatureWeaponOptions || []).map((option) => (
            <div key={option} className={styles.optionItem}>
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.armorOptions}>
        <h4>Armor Options</h4>
        <div className={styles.optionGrid}>
          {(classData.mechanics.armorOptions || []).map((armor) => (
            <div key={armor.name} className={styles.optionItem}>
              <strong>{armor.name}</strong> (Armor: {armor.armor})
              {armor.tags.length > 0 && (
                <div className={styles.tags}>
                  {armor.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRangerMechanics = () => (
    <div className={styles.mechanicsSection}>
      <h3 className={styles.sectionTitle}>
        <FaPaw className={styles.sectionIcon} />
        Animal Companion
      </h3>

      <div className={styles.companionForm}>
        <div className={styles.formGroup}>
          <label htmlFor="companion-name">Companion Name</label>
          <input
            id="companion-name"
            type="text"
            value={character.animalCompanion?.name || ''}
            onChange={(e) =>
              handleUpdateCharacter({
                animalCompanion: { ...character.animalCompanion, name: e.target.value },
              })
            }
            placeholder="Enter companion name..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="companion-species">Species</label>
          <select
            id="companion-species"
            value={character.animalCompanion?.species || ''}
            onChange={(e) =>
              handleUpdateCharacter({
                animalCompanion: { ...character.animalCompanion, species: e.target.value },
              })
            }
          >
            <option value="">Select species...</option>
            {(classData.mechanics.companionOptions?.species || []).map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Strengths</label>
          <div className={styles.checkboxGrid}>
            {(classData.mechanics.companionOptions?.strengths || []).map((strength) => (
              <label key={strength} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={character.animalCompanion?.strengths?.includes(strength) || false}
                  onChange={(e) => {
                    const currentStrengths = character.animalCompanion?.strengths || [];
                    const newStrengths = e.target.checked
                      ? [...currentStrengths, strength]
                      : currentStrengths.filter((s) => s !== strength);
                    handleUpdateCharacter({
                      animalCompanion: { ...character.animalCompanion, strengths: newStrengths },
                    });
                  }}
                />
                {strength}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Training</label>
          <div className={styles.checkboxGrid}>
            {(classData.mechanics.companionOptions?.training || []).map((training) => (
              <label key={training} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={character.animalCompanion?.training?.includes(training) || false}
                  onChange={(e) => {
                    const currentTraining = character.animalCompanion?.training || [];
                    const newTraining = e.target.checked
                      ? [...currentTraining, training]
                      : currentTraining.filter((t) => t !== training);
                    handleUpdateCharacter({
                      animalCompanion: { ...character.animalCompanion, training: newTraining },
                    });
                  }}
                />
                {training}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClericMechanics = () => (
    <div className={styles.mechanicsSection}>
      <h3 className={styles.sectionTitle}>
        <FaHandHoldingHeart className={styles.sectionIcon} />
        Divine Connection
      </h3>

      <div className={styles.divineForm}>
        <div className={styles.formGroup}>
          <label htmlFor="deity-name">Deity Name</label>
          <input
            id="deity-name"
            type="text"
            value={character.deity?.name || ''}
            onChange={(e) =>
              handleUpdateCharacter({
                deity: { ...character.deity, name: e.target.value },
              })
            }
            placeholder="Enter deity name..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deity-domain">Domain</label>
          <input
            id="deity-domain"
            type="text"
            value={character.deity?.domain || ''}
            onChange={(e) =>
              handleUpdateCharacter({
                deity: { ...character.deity, domain: e.target.value },
              })
            }
            placeholder="Enter deity domain..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deity-precept">Sacred Precept</label>
          <textarea
            id="deity-precept"
            value={character.deity?.precept || ''}
            onChange={(e) =>
              handleUpdateCharacter({
                deity: { ...character.deity, precept: e.target.value },
              })
            }
            placeholder="Enter your deity's sacred precept..."
            rows={3}
          />
        </div>
      </div>

      <div className={styles.prayerbook}>
        <h4>Prayerbook</h4>
        <div className={styles.spellLists}>
          <div className={styles.spellList}>
            <h5>Prepared Spells</h5>
            <ul className={styles.spellList}>
              {(character.prayerbook?.prepared || []).map((spell) => (
                <li key={spell} className={styles.spellItem}>
                  {spell}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.spellList}>
            <h5>Known Spells</h5>
            <ul className={styles.spellList}>
              {(character.prayerbook?.known || []).map((spell) => (
                <li key={spell} className={styles.spellItem}>
                  {spell}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaladinMechanics = () => (
    <div className={styles.mechanicsSection}>
      <h3 className={styles.sectionTitle}>
        <FaShieldHalved className={styles.sectionIcon} />
        Sacred Oath
      </h3>

      <div className={styles.oathForm}>
        <div className={styles.formGroup}>
          <label htmlFor="oath-quest">Divine Quest</label>
          <textarea
            id="oath-quest"
            value={character.oath?.quest || ''}
            onChange={(e) =>
              handleUpdateCharacter({
                oath: { ...character.oath, quest: e.target.value },
              })
            }
            placeholder="Describe your divine quest..."
            rows={4}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Oath Tenets</label>
          <div className={styles.tenetList}>
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className={styles.tenetItem}>
                <input
                  type="text"
                  value={character.oath?.tenets?.[index - 1] || ''}
                  onChange={(e) => {
                    const currentTenets = character.oath?.tenets || [];
                    const newTenets = [...currentTenets];
                    newTenets[index - 1] = e.target.value;
                    handleUpdateCharacter({
                      oath: { ...character.oath, tenets: newTenets },
                    });
                  }}
                  placeholder={`Oath tenet ${index}...`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderThiefMechanics = () => (
    <div className={styles.mechanicsSection}>
      <h3 className={styles.sectionTitle}>
        <FaShieldHalved className={styles.sectionIcon} />
        Specialized Equipment
      </h3>

      <div className={styles.specializedGear}>
        <h4>Available Gear</h4>
        <div className={styles.optionGrid}>
          {(classData.mechanics.specializedGear || []).map((gear) => (
            <div key={gear} className={styles.optionItem}>
              {gear}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.poisonTypes}>
        <h4>Poison Types</h4>
        <div className={styles.optionGrid}>
          {(classData.mechanics.poisonTypes || []).map((poison) => (
            <div key={poison} className={styles.optionItem}>
              {poison}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMechanicsContent = () => {
    switch (character.class) {
      case 'wizard':
        return renderWizardMechanics();
      case 'fighter':
        return renderFighterMechanics();
      case 'ranger':
        return renderRangerMechanics();
      case 'cleric':
        return renderClericMechanics();
      case 'paladin':
        return renderPaladinMechanics();
      case 'thief':
        return renderThiefMechanics();
      default:
        return (
          <div className={styles.mechanicsSection}>
            <p>No specific mechanics available for this class.</p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            className={styles.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            aria-label="Close modal backdrop"
          />

          <motion.div
            className={styles.modalContainer}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.modal}>
              <div className={styles.header}>
                <div className={styles.headerContent}>
                  <h2 className={styles.title}>{classData.name} Mechanics</h2>
                  <p className={styles.subtitle}>
                    Manage your class-specific abilities and resources
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <FaXmark />
                </button>
              </div>

              <div className={styles.content}>
                <div className={styles.tabs}>
                  <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'mechanics' ? styles.active : ''}`}
                    onClick={() => setActiveTab('mechanics')}
                  >
                    Class Mechanics
                  </button>
                </div>

                <div className={styles.tabContent}>
                  {activeTab === 'overview' && (
                    <div className={styles.overview}>
                      <div className={styles.classInfo}>
                        <h3>{classData.name}</h3>
                        <p className={styles.description}>{classData.description}</p>
                      </div>

                      <div className={styles.movesSummary}>
                        <h4>Starting Moves</h4>
                        <ul className={styles.movesList}>
                          {(classData.startingMoves || []).map((move) => (
                            <li key={move.id} className={styles.moveItem}>
                              <strong>{move.name}</strong>
                              <p>{move.description}</p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.advancedMoves}>
                        <h4>Advanced Moves Available</h4>
                        <ul className={styles.movesList}>
                          {(classData.advancedMoves || []).map((move) => (
                            <li key={move.id} className={styles.moveItem}>
                              <strong>{move.name}</strong> (Level {move.level})
                              <p>{move.description}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'mechanics' && (
                    <div className={styles.mechanics}>{renderMechanicsContent()}</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

ClassMechanicsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  character: PropTypes.object.isRequired,
  setCharacter: PropTypes.func.isRequired,
};

export default ClassMechanicsModal;
