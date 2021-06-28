/* eslint-disable no-unused-vars */
const { VerboseOptions } = require('./constants');

module.exports = {
  // Webpack callback function can be used to completely customize default webpack config before it's run
  // webpack: (config, options, imaConf) => {},

  // Most of the options can be overridden using CLI args (which take precedence)
  options: {
    rootDir: '', // IMA App root directory,
    publicPath: '', // Webpack assets public path
    verbose: VerboseOptions.DEFAULT, // Choose between different number of logging options
    clean: true, // Delete build folder before new build while running `ima build` script
    open: true, // Opens web browser when starting application using `ima dev` script
    scrambleCss: false, // Enables CSS scrambling (for AMP too)
    compress: true, // Enable assets compression in production build
    amp: false // Enables AMP css assets generation
  },

  // Settings related to AMP-specific css files generation
  amp: {
    styleEntryPoints: ['./app/component/**/*.less', './app/page/**/*.less'], // AMP styles entry points (array of globs)
    postCssPlugins: [] // Array of custom postcss plugins applied only to AMP entry points
  }
};
