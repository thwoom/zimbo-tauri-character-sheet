import PropTypes from 'prop-types';
import { useState } from 'react';
import { getClass, getClassNames, getClassTemplate } from '../data/classes';
import styles from './CharacterTemplateModal.module.css';

const CharacterTemplateModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const classNames = getClassNames();

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setShowCustomForm(false);
    setCustomName('');
  };

  const handleTemplateSelect = () => {
    if (!selectedClass) return;

    const template = getClassTemplate(selectedClass);
    if (!template) return;

    // Add custom name if provided
    const finalTemplate = {
      ...template,
      name: customName || template.className,
    };

    onSelectTemplate(finalTemplate);
    resetForm();
    onClose();
  };

  const handleCustomTemplate = () => {
    setShowCustomForm(true);
    setSelectedClass('');
    setCustomName('');
  };

  const resetForm = () => {
    setSelectedClass('');
    setCustomName('');
    setShowCustomForm(false);
  };

  const handleCreateCustom = () => {
    if (!customName.trim()) return;

    const customTemplate = {
      name: customName,
      class: 'custom',
      className: 'Custom Character',
      level: 1,
      hp: 20,
      maxHp: 20,
      xp: 0,
      xpNeeded: 8,
      levelUpPending: false,
      armor: 0,
      secondaryResource: 0,
      maxSecondaryResource: 0,

      stats: {
        STR: { score: 10, mod: 0 },
        DEX: { score: 10, mod: 0 },
        CON: { score: 10, mod: 0 },
        INT: { score: 10, mod: 0 },
        WIS: { score: 10, mod: 0 },
        CHA: { score: 10, mod: 0 },
      },

      resources: {
        chronoUses: 0,
        paradoxPoints: 0,
        bandages: 3,
        rations: 5,
        advGear: 5,
      },

      bonds: [
        { name: '', relationship: '', resolved: false },
        { name: '', relationship: '', resolved: false },
        { name: '', relationship: '', resolved: false },
      ],

      statusEffects: [],
      debilities: [],
      inventory: [],
      selectedMoves: [],
      actionHistory: [],
      sessionNotes: '',
      sessionRecapPublic: '',
      rollHistory: [],
      lastSessionEnd: null,
      sessionRecap: '',
    };

    onSelectTemplate(customTemplate);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Character Template</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => {
              resetForm();
              onClose();
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {!showCustomForm ? (
            <>
              <div className={styles.section}>
                <h3>Choose a Class</h3>
                <div className={styles.classGrid}>
                  {classNames.map((className) => (
                    <button
                      key={className}
                      type="button"
                      className={`${styles.classButton} ${selectedClass === className ? styles.selected : ''}`}
                      onClick={() => handleClassSelect(className)}
                    >
                      <div className={styles.className}>
                        {className.charAt(0).toUpperCase() + className.slice(1)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Or Create Custom</h3>
                <button
                  type="button"
                  className={styles.customButton}
                  onClick={handleCustomTemplate}
                >
                  Create Custom Character
                </button>
              </div>

              {selectedClass && (
                <div className={styles.section}>
                  <h3>Customize</h3>
                  <label htmlFor="character-name" className={styles.label}>
                    Character Name (Optional)
                  </label>
                  <input
                    id="character-name"
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter character name..."
                    className={styles.input}
                  />
                  {/* Class preview */}
                  <div className={styles.preview}>
                    <h4 className={styles.previewTitle}>Class Preview</h4>
                    <p className={styles.previewDescription}>
                      {getClass(selectedClass)?.description}
                    </p>
                    <div className={styles.previewMoves}>
                      <div className={styles.previewMovesTitle}>Starting Moves</div>
                      <ul>
                        {getClass(selectedClass)?.startingMoves?.map((m) => (
                          <li key={m.id}>{m.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.section}>
              <h3>Create Custom Character</h3>
              <label htmlFor="custom-name" className={styles.label}>
                Character Name
              </label>
              <input
                id="custom-name"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter character name..."
                className={styles.input}
                required
              />
              <p className={styles.helpText}>
                This will create a blank character with default stats that you can customize.
              </p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.createButton}
            onClick={showCustomForm ? handleCreateCustom : handleTemplateSelect}
            disabled={showCustomForm ? !customName.trim() : !selectedClass}
          >
            {showCustomForm ? 'Create Character' : 'Use Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

CharacterTemplateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectTemplate: PropTypes.func.isRequired,
};

export default CharacterTemplateModal;
