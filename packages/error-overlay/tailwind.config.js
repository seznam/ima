module.exports = {
  content: [
    './overlay/src/**/*.html',
    './overlay/src/**/*.js',
    './overlay/src/**/*.jsx',
    './overlay/src/**/*.ts',
    './overlay/src/**/*.tsx'
  ],
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
