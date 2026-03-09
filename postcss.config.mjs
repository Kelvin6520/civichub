export default {
  plugins: {
    '@tailwindcss/postcss': {}, // This is the fix for the error in your screenshot
    autoprefixer: {},
  },
};