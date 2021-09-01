/**
 * -------------------------------------=== NOTICE ===--------------------------------------------
 *
 * This file is used just as a reference for all possible options that can be defined
 * or expanded. By default any app should be able to be built, run and watched without
 * any additional CLI args or custom ima.config.js created.
 *
 * ima.config.js should contain mostly options that require additional complex configuration
 * or are out of scope of default build configuration. If there are any options that are mostly
 * run in production (e.g. scrambleCss) but you want to have an option to run it in dev mode too,
 * consider creating optional CLI arg for this option which should always take precedence
 *
 * -------------------------------------=== NOTICE ===--------------------------------------------
 */

module.exports = {
  /**
   * Webpack callback function can be used to completely customize default webpack config before it's run:
   * - `config` - Contains generated config by ima CLI, which can be further customized.
   * - `args` - CLI args, with additional options -> `rootDir`, `isProduction`, `isServer`, `isWatch`
   *            that help identify the current state webpack trying to run this config.
   * - `imaConfig` - Contains additional local ima.config.js file contents ({} if there's no file created).
   */
  // webpack: (config, args, imaConfig) => {},

  // Most of the options can be overridden using CLI args (which take precedence)
  publicPath: '', // Webpack assets public path
  compress: process.env.NODE_ENV === 'production', // Enable gzip compression for assets
  scrambleCss: process.env.NODE_ENV === 'production', // Enables CSS scrambling (for AMP too)

  // Settings related to AMP-specific css files generation
  amp: {
    enabled: true, // Enables AMP css assets generation
    entry: ['./app/component/**/*.less', './app/page/**/*.less'], // AMP styles entry points (array of globs)
    postCssPlugins: [] // Array of custom postcss plugins applied only to AMP entry points
  }
};
