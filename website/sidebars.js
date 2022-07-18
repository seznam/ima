/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: {
    Introduction: [
      'introduction/getting-started',
      'introduction/configuration',
    ],
    'Basic Features': [
      'basic-features/controller-lifecycle',
      'basic-features/dictionary',
      'basic-features/errors',
      'basic-features/events',
      'basic-features/extensions',
      'basic-features/object-container',
      'basic-features/page-manager',
      'basic-features/page-state',
      'basic-features/rendering-process',
      'basic-features/routing',
      'basic-features/seo-and-meta-manager',
      'basic-features/views-and-components',
    ],
    CLI: [
      'cli/cli',
      'cli/compiler-features',
      'cli/ima.config.js',
      'cli/plugins-api',
      {
        'CLI Plugins': [
          'cli/plugins/analyze-plugin',
          'cli/plugins/scramble-css-plugin',
          'cli/plugins/less-constants-plugin',
        ],
      },
    ],
    Plugins: ['plugins/available-plugins', 'plugins/plugin-interface'],
    Devtools: [
      'devtools/devtools-introduction',
      'devtools/devtools-ui',
      'devtools/devtools-options',
    ],
    Migration: [
      'migration/migration-0.14.0',
      'migration/migration-0.15.0',
      'migration/migration-0.16.0',
      'migration/migration-17.0.0',
    ],
  },
};

module.exports = sidebars;
