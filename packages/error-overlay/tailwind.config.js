module.exports = {
  content: [
    './overlay/src/**/*.html',
    './overlay/src/**/*.js',
    './overlay/src/**/*.jsx',
    './overlay/src/**/*.ts',
    './overlay/src/**/*.tsx'
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(0) scale(0.99)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          }
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.1s ease-out'
      }
    }
  },
  plugins: []
};
