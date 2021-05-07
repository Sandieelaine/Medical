module.exports = {
  purge: ['./src/**/*.{html,ts}'],
  // purge: false,
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')
],
};
