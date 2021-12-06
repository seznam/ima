module.exports = {
  mode: 'jit',
  purge: [
    './overlay/src/**/*.html',
    './overlay/src/**/*.js',
    './overlay/src/**/*.jsx',
    './overlay/src/**/*.ts',
    './overlay/src/**/*.tsx'
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {}
  },
  theme: {
    container: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    }
  },
  plugins: []
};
