import PropTypes from 'prop-types';
import glassStyles from '../styles/glassmorphic.module.css';
import ModalBase from './ui/ModalBase.jsx';

const MOVE_CONTENT = {
  'Hack and Slash': {
    summary: 'When you attack an enemy in melee, roll 2d6 + STR.',
    results: [
      '10+: You deal your damage to the enemy and avoid their attack.',
      '7-9: You deal your damage to the enemy and the enemy makes an attack against you.',
      '6-: The GM makes a move.',
    ],
    example:
      'You swing your warhammer at the orc guard. On a 7-9, you deal damage but he counters, forcing you to Defy Danger.',
  },
  'Defy Danger': {
    summary: 'When you act despite an imminent threat, roll 2d6 + the relevant stat.',
    results: [
      '10+: You do what you set out to, the threat doesn’t come to bear.',
      '7-9: You stumble, hesitate, or flinch: the GM will offer you a worse outcome, hard bargain, or ugly choice.',
      '6-: The GM makes a move.',
    ],
    example:
      'You dart through falling debris (DEX). On a 7-9, you reach cover but drop your weapon or take a risk.',
  },
  'Spout Lore': {
    summary: 'When you consult your accumulated knowledge about something, roll 2d6 + INT.',
    options: [
      'You can ask the GM to tell you something interesting and useful about the subject.',
      'On a miss, the GM may ask you how you know this and the answer will be troubling.',
    ],
    results: [
      '10+: The GM will tell you something interesting and useful about the subject.',
      '7-9: The GM will only tell you something interesting—it’s on you to make it useful.',
      '6-: The GM makes a move; they may also ask how you know this.',
    ],
    example:
      'You examine an ancient sigil. On a 7-9, you recall it’s tied to a forgotten cult, but you’ll need time or resources to learn how to use that info.',
  },
};

export default function MoveInfoModal({ isOpen, onClose, moveName, rollResult }) {
  if (!isOpen) return null;
  const content = MOVE_CONTENT[moveName] || { summary: 'Unknown move', results: [], example: '' };
  const total = Number(rollResult);
  const status = Number.isFinite(total)
    ? total >= 10
      ? { label: 'Strong Hit', cls: glassStyles.glassStatusSuccess }
      : total >= 7
        ? { label: 'Partial Success', cls: glassStyles.glassStatusWarning }
        : { label: 'Miss', cls: glassStyles.glassStatusError }
    : null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      header={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <strong>{moveName}</strong>
          <span style={{ opacity: 0.8 }}>— Result: {rollResult ?? ''}</span>
        </div>
      }
    >
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        {status && (
          <div className={`${glassStyles.glassStatus} ${status.cls}`} role="status">
            <strong style={{ marginRight: 8 }}>{status.label}</strong>
            <span>Total: {total}</span>
          </div>
        )}

        <div style={{ color: 'var(--color-text, #d0d7e2)' }}>{content.summary}</div>

        <div className={glassStyles.glassDivider} />

        {content.results && content.results.length > 0 && (
          <section>
            <h4 style={{ margin: '0 0 8px 0' }}>Outcomes</h4>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
              {content.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {content.options && (
          <section>
            <h4 style={{ margin: '0 0 8px 0' }}>Options to remember</h4>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
              {content.options.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>
        )}

        {content.example && (
          <section>
            <h4 style={{ margin: '0 0 8px 0' }}>Example</h4>
            <div className={glassStyles.glassCard}>{content.example}</div>
          </section>
        )}
      </div>
    </ModalBase>
  );
}

MoveInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  moveName: PropTypes.string,
  rollResult: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
