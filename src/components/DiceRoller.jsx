import PropTypes from 'prop-types';
import React from 'react';
import { FaDiceD20 } from 'react-icons/fa6';
import RollModal from './RollModal.jsx';
import { panelStyle, buttonStyle } from './styles.js';

const DiceRoller = ({
  character,
  rollDice,
  rollResult,
  rollHistory,
  equippedWeaponDamage,
  rollModal,
  rollModalData,
}) => (
  <>
    <div style={panelStyle}>
      <h3
        style={{
          color: '#00ff88',
          marginBottom: '15px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <FaDiceD20 /> Dice Roller
      </h3>

      {/* Stat Check Buttons */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1rem' }}>Stat Checks</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
          {Object.entries(character.stats).map(([stat, data]) => (
            <button
              key={stat}
              onClick={() => rollDice(`2d6+${data.mod}`, `${stat} Check`)}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                padding: '8px 6px',
                margin: '2px',
                fontSize: '11px',
              }}
            >
              {stat} ({data.mod >= 0 ? '+' : ''}
              {data.mod})
            </button>
          ))}
        </div>
      </div>

      {/* Combat Rolls */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1rem' }}>Combat Rolls</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
          <button
            onClick={() => rollDice(equippedWeaponDamage, 'Weapon Damage')}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(45deg, #ef4444, #dc2626)',
              margin: '2px',
              fontSize: '11px',
            }}
          >
            Weapon ({equippedWeaponDamage})
          </button>
          <button
            onClick={() => rollDice('2d6+3', 'Hack & Slash')}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
              margin: '2px',
              fontSize: '11px',
            }}
          >
            Hack & Slash
          </button>
          <button
            onClick={() => rollDice('d4', 'Upper Hand')}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(45deg, #f97316, #ea580c)',
              margin: '2px',
              fontSize: '11px',
            }}
          >
            Upper Hand d4
          </button>
          <button
            onClick={() => rollDice('2d6-1', 'Taunt')}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(45deg, #eab308, #d97706)',
              margin: '2px',
              fontSize: '11px',
            }}
          >
            Taunt Enemy
          </button>
        </div>
      </div>

      {/* Basic Dice */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1rem' }}>Basic Dice</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
          {[4, 6, 8, 10, 12, 20].map((sides) => (
            <button
              key={sides}
              onClick={() => rollDice(`d${sides}`)}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(45deg, #06b6d4, #0891b2)',
                padding: '8px 4px',
                margin: '2px',
                fontSize: '11px',
              }}
            >
              d{sides}
            </button>
          ))}
        </div>
      </div>

      {/* Roll Result Display */}
      <div
        style={{
          background: 'rgba(0, 255, 136, 0.2)',
          padding: '10px',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: 'bold',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {rollResult}
      </div>

      {/* Roll History */}
      {rollHistory.length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
          <div style={{ color: '#00ff88', marginBottom: '5px' }}>Recent Rolls:</div>
          {rollHistory.slice(0, 3).map((roll, index) => (
            <div key={index} style={{ color: '#aaa', marginBottom: '2px' }}>
              <span style={{ color: '#00ff88' }}>{roll.timestamp}</span> - {roll.result}
            </div>
          ))}
        </div>
      )}
    </div>
    <RollModal isOpen={rollModal.isOpen} data={rollModalData} onClose={rollModal.close} />
  </>
);
DiceRoller.propTypes = {
  character: PropTypes.shape({
    stats: PropTypes.object.isRequired,
  }).isRequired,
  rollDice: PropTypes.func.isRequired,
  rollResult: PropTypes.string.isRequired,
  rollHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  equippedWeaponDamage: PropTypes.string.isRequired,
  rollModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  }).isRequired,
  rollModalData: PropTypes.object.isRequired,
};

export default DiceRoller;
