const path = require('path');

const themes = require('prism-react-renderer').themes;
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.palenight;

/**
 * @ts-check
 * @type {import('@docusaurus/types').Config}
 */
const config = {
  title: 'IMA.js',
  tagline: 'A Javascript framework for creating isomorphic applications.',
  url: 'https://imajs.io/',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'seznam',
  projectName: 'ima',
  plugins: [
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     entryPoints: [
    //       '../packages/core',
    //       '../packages/react-page-renderer',
    //       '../packages/cli',
    //       '../packages/plugin-cli',
    //       '../packages/dev-utils',
    //       '../packages/server',
    //       '../packages/storybook-integration',
    //     ],
    //     entryPointStrategy: 'packages',
    //     out: '../../docs/api',
    //     sidebar: {
    //       fullNames: true,
    //     },
    //   },
    // ],
    () => ({
      name: 'resolve-react',
      configureWebpack() {
        return {
          resolve: {
            alias: {
              // Fix for webpack loading conflicting versions of react
              react: path.resolve('./node_modules/react'),
            },
          },
        };
      },
    }),
  ],
  presets: [
    [
      'classic',
      /**
       * @type {import('@docusaurus/preset-classic').Options}
       */
      ({
        docs: {
          breadcrumbs: false,
          path: '../docs',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/seznam/ima/tree/master/docs',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        pages: {
          path: 'src/pages',
          routeBasePath: '/',
          include: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],
  /**
   * @type {import('@docusaurus/preset-classic').ThemeConfig}
   */
  themeConfig: {
    algolia: {
      appId: 'H3HJGI4FWU',
      apiKey: '9afc43748aad4ed8acb6968a0b5473d0',
      indexName: 'imajs',
    },
    navbar: {
      title: 'IMA.js',
      logo: {
        alt: 'IMA.js, Isomorphic application in javascript',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'introduction/getting-started',
          position: 'right',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'tutorial/introduction',
          position: 'right',
          label: 'Tutorial',
        },
        {
          to: 'api/modules',
          position: 'right',
          label: 'API',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/seznam/ima',
          className: 'header-github-link',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © 1996 - ${new Date().getFullYear()} Seznam.cz a. s.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    tableOfContents: {
      maxHeadingLevel: 4,
    },
  },
};

module.exports = config;
