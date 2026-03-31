/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        charcoal: 'var(--charcoal)',
        forest: 'var(--forest)',
        'forest-dark': 'var(--forest-dark)',
        'forest-mid': 'var(--forest-mid)',
        sage: 'var(--sage)',
        'sage-light': 'var(--sage-light)',
        amber: 'var(--amber)',
        'amber-light': 'var(--amber-light)',
        'amber-pale': 'var(--amber-pale)',
        cream: 'var(--cream)',
        'cream-dark': 'var(--cream-dark)',
        warmWhite: 'var(--warm-white)',
      },
    },
  },
  plugins: [],
};
