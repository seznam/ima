/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  api: [
    {
      type: 'autogenerated',
      dirName: 'api',
    },
  ],
  tutorial: [
    {
      type: 'category',
      label: 'Tutorial',
      collapsed: false,
      items: [
        'tutorial/introduction',
        'tutorial/static-view',
        'tutorial/adding-some-state',
        'tutorial/fetching-data',
        'tutorial/writing-posts',
        'tutorial/final-polish',
      ],
    },
  ],
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
        'basic-features/views-and-components',
        'basic-features/fetching-data',
        {
          type: 'category',
          label: 'Routing',
          collapsed: true,
          items: [
            'basic-features/routing/introduction',
            'basic-features/routing/dynamic-routes',
            'basic-features/routing/middlewares',
            'basic-features/routing/async-routing',
          ],
        },
        'basic-features/extensions',
        'basic-features/object-container',
        'basic-features/rendering-process',
        'basic-features/handling-scripts-and-styles',
        'basic-features/page-manager',
        'basic-features/events',
        'basic-features/page-state',
        'basic-features/seo-and-meta-manager',
        'basic-features/dictionary',
        'basic-features/errors',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Features',
      collapsed: false,
      items: ['advanced-features/dynamic-imports'],
    },
    {
      type: 'category',
      label: 'CLI',
      collapsed: false,
      items: [
        'cli/cli',
        'cli/compiler-features',
        'cli/ima.config.js',
        'cli/additional-features',
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