const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/palenight');

/**
 * @ts-check
 * @type {import('@docusaurus/types').Config}
 */
const config = {
  title: 'IMA.js',
  tagline: 'Isomorphic application in javascript',
  url: 'https://imajs.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'seznam',
  projectName: 'ima',

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
          editUrl: 'https://github.com/seznam/ima/tree/docusaurus/docs',
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

  themeConfig:
    /**
     * @type {import('@docusaurus/preset-classic').ThemeConfig}
     */
    {
      algolia: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_SEARCH_API_KEY',
        indexName: 'YOUR_INDEX_NAME',
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
            to: 'api/general/bootstrap',
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
    },
};

module.exports = config;
