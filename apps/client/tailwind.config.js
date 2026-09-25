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
        // Dark sections and their highlight: a deep, slightly warm charcoal and a
        // lighter copper that keeps contrast on it (accent is too dark on `night`).
        night: '#14161A',
        ember: '#E7A86F',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1.12) translate(-1%, -1%)' },
        },
        flow: {
          to: { strokeDashoffset: '-40' },
        },
      },
      animation: {
        kenburns: 'kenburns 28s ease-in-out infinite alternate',
        flow: 'flow 3s linear infinite',
      },
    },
  },
  plugins: [],
};
