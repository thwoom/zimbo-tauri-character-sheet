import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Disable preflight to avoid conflicts with Arwes SVG styling
  preflight: false,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          // Arwes-inspired color palette
          primary: { value: '#00d9ff' },
          secondary: { value: '#ff0080' },
          accent: { value: '#ffa726' },
          background: { value: '#001114' },
          surface: { value: '#021e26' },
          text: { value: '#7efcf6' },
          muted: { value: '#456c74' },
        },
        spacing: {
          xs: { value: '0.25rem' },
          sm: { value: '0.5rem' },
          md: { value: '1rem' },
          lg: { value: '1.5rem' },
          xl: { value: '2rem' },
          '2xl': { value: '3rem' },
          '3xl': { value: '4rem' },
        },
        radii: {
          none: { value: '0' },
          sm: { value: '2px' },
          md: { value: '4px' },
          lg: { value: '8px' },
          full: { value: '9999px' },
        },
        fonts: {
          body: { value: 'system-ui, -apple-system, sans-serif' },
          heading: { value: 'system-ui, -apple-system, sans-serif' },
          mono: { value: 'Consolas, Monaco, monospace' },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "src/styled-system",
});
