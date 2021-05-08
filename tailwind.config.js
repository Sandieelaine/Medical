module.exports = {
  purge: ['./src/**/*.{html,ts}'],
  // purge: false,
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'gems-primary-blue': '#004c85',
        'gems-secondary-blue': '#1077bc',
        'gems-primary-yellow': '#f8ad20',
        'gems-secondary-yellow': '#d47919',
        'tanzanite_one': '#2b7ec0',
        'beryl': '#f9ad41',
        'ruby': '#de3a41',
        'emerald': '#31b055',
        'emerald_value': '#16b7a7',
        'onyx': '#7b8084',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')
],
};
