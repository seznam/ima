const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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
          path: '../docs',
          routeBasePath: '/',
          showLastUpdateTime: true,
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/seznam/ima/tree/master/docs',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /**
     * @type {import('@docusaurus/preset-classic').ThemeConfig}
     */
    {
      navbar: {
        title: 'IMA.js',
        logo: {
          alt: 'IMA.js, Isomorphic application in javascript',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            type: 'doc',
            docId: 'introduction/getting-started',
            position: 'right',
            label: 'Docs',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://github.com/seznam/ima',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Style Guide',
                to: 'docs/',
              },
              {
                label: 'Second Doc',
                to: 'docs/doc2/',
              },
            ],
          },
        ],
        copyright: `Copyright © 1996 - ${new Date().getFullYear()} Seznam.cz a. s.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    },
};

module.exports = config;
