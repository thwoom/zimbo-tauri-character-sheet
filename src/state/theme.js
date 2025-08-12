export const cosmicTheme = {
  '--color-bg-start': '#0b0d17',
  '--color-bg-end': '#1a1f38',
  '--color-text': '#d0d7e2',

  '--color-accent': '#5fd1c1',
  '--color-accent-dark': '#3fa39e',
  '--color-accent-darker': '#2b6c65',
  '--color-accent-rgb': '95, 209, 193',

  '--color-gray-400': '#6b7280',
  '--color-gray-500': '#4b5563',
  '--color-gray-600': '#374151',

  '--color-red': '#b84f5e',
  '--color-red-dark': '#9b3744',
  '--color-red-rgb': '184, 79, 94',

  '--color-orange': '#c9824a',
  '--color-orange-dark': '#a7623c',
  '--color-orange-rgb': '201, 130, 74',

  '--color-purple': '#6e5aa3',
  '--color-purple-dark': '#59458c',

  '--color-blue': '#4f6db8',
  '--color-blue-dark': '#324f99',

  '--color-green': '#4ab381',
  '--color-green-dark': '#3a8f66',
  '--color-green-rgb': '74, 179, 129',

  '--overlay-poison': 'rgba(var(--color-accent-rgb), 0.1)',
  '--overlay-burning': 'rgba(var(--color-red-rgb), 0.15)',
  '--overlay-shocked-blue': 'rgba(79, 109, 184, 0.1)',
  '--overlay-shocked-gold': 'rgba(169, 142, 98, 0.1)',
  '--overlay-frozen': 'rgba(var(--color-accent-rgb), 0.1)',
  '--overlay-blessed': 'rgba(251, 191, 36, 0.1)',
  '--overlay-dark': 'rgba(0, 0, 0, 0.2)',
  '--overlay-darker': 'rgba(0, 0, 0, 0.3)',

  '--panel-bg': 'rgba(255, 255, 255, 0.1)',
  '--panel-border': 'rgba(var(--color-accent-rgb), 0.3)',
  '--panel-shadow': 'rgba(0, 0, 0, 0.3)',

  '--glow-shadow': 'rgba(var(--color-accent-rgb), 0.3)',
  '--glow-shadow-strong': 'rgba(var(--color-accent-rgb), 0.6)',
  '--text-glow': 'rgba(var(--color-accent-rgb), 0.5)',
  '--loading-shimmer':
    'linear-gradient(90deg, transparent, rgba(var(--color-accent-rgb), 0.2), transparent)',

  '--success-border': 'var(--color-green)',
  '--success-shadow': 'rgba(var(--color-green-rgb), 0.4)',
  '--warning-border': 'var(--color-orange)',
  '--warning-shadow': 'rgba(var(--color-orange-rgb), 0.4)',
  '--error-border': 'var(--color-red)',
  '--error-shadow': 'rgba(var(--color-red-rgb), 0.4)',

  '--status-healthy-start': 'var(--color-green)',
  '--status-healthy-end': 'var(--color-green-dark)',
  '--status-healthy-shadow': 'rgba(var(--color-green-rgb), 0.6)',

  '--status-injured-start': 'var(--color-orange)',
  '--status-injured-end': 'var(--color-orange-dark)',
  '--status-injured-shadow': 'rgba(var(--color-orange-rgb), 0.6)',

  '--status-critical-start': 'var(--color-red)',
  '--status-critical-end': 'var(--color-red-dark)',
  '--status-critical-shadow': 'rgba(var(--color-red-rgb), 0.6)',

  '--equipped-item-border': 'var(--color-green)',
  '--equipped-item-bg': 'rgba(var(--color-green-rgb), 0.1)',
  '--unequipped-item-border': 'var(--color-gray-400)',

  '--critical-hit-start': '#c0a65a',
  '--critical-hit-end': 'var(--color-orange)',
  '--critical-failure-start': 'var(--color-red)',
  '--critical-failure-end': 'var(--color-red-dark)',

  '--background': 'linear-gradient(135deg, var(--color-bg-start), var(--color-bg-end))',
  '--text-color': 'var(--color-text)',
  '--accent-color': 'var(--color-accent)',
  '--accent-shadow': 'var(--glow-shadow)',
};

export const classicTheme = {
  ...cosmicTheme,
  '--color-bg-start': '#f4f4f4',
  '--color-bg-end': '#e0e0e0',
  '--color-text': '#222222',
  '--color-accent': '#3333ff',
  '--color-accent-dark': '#1a1acc',
  '--color-accent-darker': '#000099',
  '--color-accent-rgb': '51, 51, 255',
  '--color-gray-400': '#d1d5db',
  '--color-gray-500': '#9ca3af',
  '--color-gray-600': '#6b7280',
  '--panel-bg': 'rgba(0, 0, 0, 0.05)',
  '--panel-shadow': 'rgba(0, 0, 0, 0.1)',
};

export const THEMES = {
  cosmic: cosmicTheme,
  classic: classicTheme,
};

export const DEFAULT_THEME = 'cosmic';
