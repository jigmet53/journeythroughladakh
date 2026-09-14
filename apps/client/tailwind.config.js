/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // BRD.md §48 — earthy, low-saturation palette; avoid bright/saturated colors.
      colors: {
        sky: '#A9D6E5',
        mountain: '#6B7280',
        earth: '#8B5E3C',
        sand: '#D8C3A5',
        stone: '#3F3F46',
        snow: '#F8FAFC',
        accent: '#C08457',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
