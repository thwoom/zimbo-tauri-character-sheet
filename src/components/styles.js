import { baseColors } from '../styles/colorMap.js';

export const panelStyle = {
  background: 'var(--panel-bg)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid var(--panel-border)',
  boxShadow: '0 8px 32px var(--panel-shadow)',
};

export const buttonStyle = {
  background: 'linear-gradient(45deg, var(--color-accent), var(--color-accent-dark))',
  border: 'none',
  borderRadius: '6px',
  color: baseColors.white,
  padding: '8px 15px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  margin: '5px',
};
