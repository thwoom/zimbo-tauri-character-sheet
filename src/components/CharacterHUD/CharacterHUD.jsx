import { useEffect, useState } from 'react';
import { FaDice, FaHeart, FaStar, FaThumbtack, FaWeightHanging } from 'react-icons/fa6';
import useInventory from '../../hooks/useInventory';
import { useCharacter } from '../../state/CharacterContext';
import Button from '../common/Button';
import ButtonGroup from '../common/ButtonGroup';
import Panel from '../ui/Panel';
import CastIndicator from './CastIndicator';
import Nameplate from './Nameplate';
import Portrait from './Portrait';
import ResourceBars from './ResourceBars';
import StatusTray from './StatusTray';

export default function CharacterHUD({
  onMountChange = () => {},
  rollDie = () => {},
  setRollResult = () => {},
}) {
  const { character } = useCharacter();
  const { totalWeight, maxLoad } = useInventory(character);
  const [showQuickRoller, setShowQuickRoller] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    onMountChange(true);
    return () => onMountChange(false);
  }, [onMountChange]);

  // Calculate XP progress
  const xpProgress = (character.xp / character.xpNeeded) * 100;

  // Get equipped weapon
  const equippedWeapon = character.inventory.find(
    (item) => item.equipped && item.slot === 'weapon',
  );

  // Get unresolved bonds count
  const unresolvedBonds = character.bonds.filter((bond) => !bond.resolved).length;

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote, timestamp: new Date() }]);
      setNewNote('');
    }
  };

  const removeNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const quickRoll = (formula, label) => {
    rollDie(formula, label);
  };

  return (
    <Panel
      glow="hero"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-sm)',
      }}
    >
      <Nameplate />
      <Portrait />
      <ResourceBars
        primary={{ current: character.hp, max: character.maxHp }}
        secondary={
          character.maxSecondaryResource > 0
            ? {
                current: character.secondaryResource,
                max: character.maxSecondaryResource,
              }
            : null
        }
        shield={character.shield > 0 ? { current: character.shield, max: character.maxHp } : null}
      />

      {/* XP Progress Bar */}
      <div style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--color-accent)',
          }}
        >
          <span>
            XP: {character.xp}/{character.xpNeeded}
          </span>
          <span>Level {character.level}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              width: `${xpProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-accent), var(--color-neon))',
              transition: 'width 0.5s ease',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      {/* Load/Encumbrance Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          fontSize: '0.8rem',
          color: totalWeight > maxLoad ? 'var(--color-danger)' : 'var(--color-gray-400)',
          marginTop: 'var(--space-sm)',
        }}
      >
        <FaWeightHanging />
        <span>
          Load: {totalWeight}/{maxLoad}
        </span>
      </div>

      {/* Current Weapon Display */}
      {equippedWeapon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            fontSize: '0.8rem',
            color: 'var(--color-accent)',
            marginTop: 'var(--space-sm)',
          }}
        >
          <FaStar />
          <span>{equippedWeapon.name}</span>
          <span style={{ color: 'var(--color-gray-400)' }}>({equippedWeapon.damage || '1d6'})</span>
        </div>
      )}

      {/* Bonds Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          fontSize: '0.8rem',
          color: unresolvedBonds > 0 ? 'var(--color-warning)' : 'var(--color-gray-400)',
          marginTop: 'var(--space-sm)',
        }}
      >
        <FaHeart />
        <span>Bonds: {unresolvedBonds} unresolved</span>
      </div>

      {/* Quick Dice Roller */}
      <div style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
        <Button
          onClick={() => setShowQuickRoller(!showQuickRoller)}
          style={{ width: '100%', fontSize: '0.8rem' }}
        >
          <FaDice /> Quick Roller
        </Button>

        {showQuickRoller && (
          <div
            style={{
              marginTop: 'var(--space-sm)',
              padding: 'var(--space-sm)',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--hud-radius-sm)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <ButtonGroup style={{ flexWrap: 'wrap', gap: '4px' }}>
              <Button
                onClick={() => quickRoll('2d6+0', 'Defy Danger')}
                style={{ fontSize: '0.7rem' }}
              >
                Defy Danger
              </Button>
              <Button
                onClick={() => quickRoll('2d6+0', 'Hack & Slash')}
                style={{ fontSize: '0.7rem' }}
              >
                Hack & Slash
              </Button>
              <Button onClick={() => quickRoll('2d6+0', 'Volley')} style={{ fontSize: '0.7rem' }}>
                Volley
              </Button>
              <Button
                onClick={() => quickRoll(equippedWeapon?.damage || '1d6', 'Damage')}
                style={{ fontSize: '0.7rem' }}
              >
                Damage
              </Button>
            </ButtonGroup>
          </div>
        )}
      </div>

      {/* Note Pins */}
      <div style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-xs)',
          }}
        >
          <FaThumbtack />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>Notes</span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add note..."
            style={{
              flex: 1,
              fontSize: '0.7rem',
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--hud-radius-sm)',
              color: 'var(--color-text)',
            }}
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
          />
          <Button onClick={addNote} style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
            +
          </Button>
        </div>

        {notes.length > 0 && (
          <div style={{ marginTop: 'var(--space-xs)' }}>
            {notes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.7rem',
                  padding: '2px 4px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '2px',
                  marginBottom: '2px',
                }}
              >
                <span style={{ flex: 1, color: 'var(--color-gray-300)' }}>{note.text}</span>
                <Button
                  onClick={() => removeNote(note.id)}
                  style={{ fontSize: '0.6rem', padding: '1px 4px', minWidth: 'auto' }}
                >
                  ×
                </Button>
              </div>
            ))}
            {notes.length > 3 && (
              <div
                style={{ fontSize: '0.6rem', color: 'var(--color-gray-500)', textAlign: 'center' }}
              >
                +{notes.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>

      <StatusTray />
      <CastIndicator />
    </Panel>
  );
}
