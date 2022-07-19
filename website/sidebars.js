/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: ['introduction/getting-started', 'introduction/configuration'],
    },
    {
      type: 'category',
      label: 'Basic Features',
      collapsed: false,
      items: [
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
    },
    {
      type: 'category',
      label: 'CLI',
      collapsed: false,
      items: [
        'cli/cli',
        'cli/compiler-features',
        'cli/ima.config.js',
        'cli/advanced-features',
        'cli/plugins-api',
        {
          'CLI Plugins': [
            'cli/plugins/analyze-plugin',
            'cli/plugins/scramble-css-plugin',
            'cli/plugins/less-constants-plugin',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Plugins',
      collapsed: false,
      items: ['plugins/available-plugins', 'plugins/plugin-interface'],
    },
    {
      type: 'category',
      label: 'Devtools',
      collapsed: true,
      items: [
        'devtools/devtools-introduction',
        'devtools/devtools-ui',
        'devtools/devtools-options',
      ],
    },
    {
      type: 'category',
      label: 'Migration',
      collapsed: true,
      items: [
        'migration/migration-0.14.0',
        'migration/migration-0.15.0',
        'migration/migration-0.16.0',
        'migration/migration-17.0.0',
      ],
    },
  ],
};

module.exports = sidebars;
