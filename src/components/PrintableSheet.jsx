import PropTypes from 'prop-types';
import React from 'react';

export default function PrintableSheet({ character }) {
  const {
    stats,
    hp,
    maxHp,
    resources,
    inventory,
    bonds,
    statusEffects,
    debilities,
    level,
    xp,
    xpNeeded,
  } = character;

  return (
    <div style={{ padding: '16px', color: '#000', background: '#fff' }}>
      <h1 style={{ marginBottom: '8px' }}>Character Sheet</h1>
      <div style={{ marginBottom: '8px' }}>
        Level {level} — XP: {xp}/{xpNeeded}
      </div>
      <div style={{ marginBottom: '8px' }}>
        HP: {hp}/{maxHp}
      </div>

      <h2 style={{ marginTop: '16px' }}>Stats</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Stat</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Score</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Mod</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats).map(([key, val]) => (
            <tr key={key}>
              <td style={{ padding: '4px 0' }}>{key}</td>
              <td style={{ padding: '4px 0' }}>{val.score}</td>
              <td style={{ padding: '4px 0' }}>{val.mod >= 0 ? `+${val.mod}` : val.mod}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '16px' }}>Resources</h2>
      <ul>
        {Object.entries(resources).map(([key, val]) => (
          <li key={key}>
            {key}: {String(val)}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '16px' }}>Inventory</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.name}
            {item.quantity ? ` x${item.quantity}` : ''}
            {item.damage ? ` — ${item.damage}` : ''}
            {item.armor ? ` — +${item.armor} armor` : ''}
            {item.equipped ? ' (equipped)' : ''}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '16px' }}>Bonds</h2>
      <ul>
        {bonds.map((b, idx) => (
          <li key={idx}>
            <strong>{b.name}:</strong> {b.relationship} {b.resolved ? '(resolved)' : ''}
          </li>
        ))}
      </ul>

      {(statusEffects.length > 0 || debilities.length > 0) && (
        <>
          <h2 style={{ marginTop: '16px' }}>Conditions</h2>
          {statusEffects.length > 0 && <div>Statuses: {statusEffects.join(', ')}</div>}
          {debilities.length > 0 && <div>Debilities: {debilities.join(', ')}</div>}
        </>
      )}
    </div>
  );
}

PrintableSheet.propTypes = {
  character: PropTypes.shape({
    stats: PropTypes.object.isRequired,
    hp: PropTypes.number.isRequired,
    maxHp: PropTypes.number.isRequired,
    resources: PropTypes.object.isRequired,
    inventory: PropTypes.array.isRequired,
    bonds: PropTypes.array.isRequired,
    statusEffects: PropTypes.array.isRequired,
    debilities: PropTypes.array.isRequired,
    level: PropTypes.number.isRequired,
    xp: PropTypes.number.isRequired,
    xpNeeded: PropTypes.number.isRequired,
  }).isRequired,
};
