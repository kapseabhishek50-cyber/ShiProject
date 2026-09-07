/** @type {import('tailwindcss').Config} */

// Colours are declared once in src/index.css as custom properties and referenced
// here by role. Tailwind never learns a hex value, so light/dark swap in one
// place and a component can only ask for a role ('surface', 'ink-muted',
// 'series-1') - which is what keeps a raw hex out of the chart code.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        plane: 'var(--plane)',
        surface: 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--text-primary)',
        'ink-2': 'var(--text-secondary)',
        'ink-muted': 'var(--text-muted)',
        hairline: 'var(--border)',
        grid: 'var(--gridline)',
        baseline: 'var(--baseline)',
        'series-1': 'var(--series-1)',
        'series-2': 'var(--series-2)',
        'series-3': 'var(--series-3)',
        good: 'var(--status-good)',
        warning: 'var(--status-warning)',
        serious: 'var(--status-serious)',
        critical: 'var(--status-critical)',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
      },
      borderRadius: { card: '10px' },
      boxShadow: { card: '0 1px 2px rgba(11,11,11,0.04)' },
    },
  },
  plugins: [],
};
