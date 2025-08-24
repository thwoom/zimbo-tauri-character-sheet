import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Disable preflight to avoid conflicts with existing styling
  preflight: false,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {
      tokens: {
        colors: {
          // Sci-fi inspired color palette
          primary: { value: '#00d9ff' },
          secondary: { value: '#00ffff' },
          accent: { value: '#64f1e1' },
          success: { value: '#4ab381' },
          warning: { value: '#ffc107' },
          danger: { value: '#dc3545' },
          info: { value: '#17a2b8' },
          neutral: { value: '#6b7280' },
          'neutral-light': { value: '#d0d7e2' },
          'neutral-dark': { value: '#374151' },
          'bg-start': { value: '#020e26' },
          'bg-end': { value: '#0a1a3a' },
          'text-primary': { value: '#d0d7e2' },
          'text-secondary': { value: '#6b7280' },
          // Glass morphism colors
          glass: { value: 'rgba(255, 255, 255, 0.05)' },
          'glass-border': { value: 'rgba(95, 209, 193, 0.3)' },
          'glass-shadow': { value: '0 8px 32px rgba(0, 0, 0, 0.3)' },
        },
        fonts: {
          heading: { value: 'var(--font-heading)' },
          body: { value: 'var(--font-body)' },
        },
        spacing: {
          sm: { value: 'var(--space-sm)' },
          md: { value: 'var(--space-md)' },
          lg: { value: 'var(--space-lg)' },
        },
        radii: {
          sm: { value: 'var(--hud-radius-sm)' },
          md: { value: 'var(--hud-radius)' },
        },
        blur: {
          glass: { value: 'var(--glass-blur)' },
        },
      },
    },
  },
  utilities: {
    extend: {
      backdropBlur: {
        glass: { value: 'blur(var(--glass-blur))' },
      },
    },
  },
  outdir: 'src/styled-system',
});
