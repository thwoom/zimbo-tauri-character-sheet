/** @type {import('tailwindcss').Config} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const forms = require('@tailwindcss/forms');

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fg: 'hsl(var(--fg) / <alpha-value>)',
        bg: 'hsl(var(--bg) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        glass: 'var(--glass-bg)',
        neon: 'var(--color-neon)',
      },
      spacing: {
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        glow: '0 0 8px var(--glow-shadow)',
        glass: 'var(--shadow-glass)',
        neon: 'var(--shadow-neon)',
      },
    },
  },
  plugins: [forms],
};
