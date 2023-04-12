const memoizeOne = require('memoize-one');

/**
 * Render styles resource definition to HTML string with links to CSS files.
 *
 * @param styles Styles resource definition.
 * @returns string HTML string of link tags to given CSS files.
 */
function renderStyles(styles) {
  if (!Array.isArray(styles)) {
    return '';
  }

  return [
    ...styles.reduce((acc, cur) => {
      if (typeof cur === 'string') {
        acc += `<link as="style" href="${cur}" rel="preload" type="text/css" />`;

        return acc;
      }

      const [href, { preload = true }] = cur;

      if (preload) {
        acc += `<link as="style" href="${href}" rel="preload" type="text/css" />`;
      }

      return acc;
    }, ''),
    ...styles.reduce((acc, cur) => {
      if (typeof cur === 'string') {
        acc += `<link rel="stylesheet" href="${cur}" />`;

        return acc;
      }

      const [
        href,
        { fallback = null, preload, rel = 'stylesheet', ...options },
      ] = cur;
      let link = `<link href="${href}" rel="${rel}"`;

      // Generate fallback handler
      if (fallback) {
        link += ` onerror="this.onerror=null;this.href='${fallback}';"`;
      }

      // Generate other attributes
      for (const [attr, value] of Object.entries(options)) {
        link += ` ${attr}="${value}"`;
      }

      acc += link + ' />';

      return acc;
    }, ''),
  ].join('');
}

/**
 * Wrap script contents into script tag with given ID.
 *
 * @param name Script element ID.
 * @param script Script contents.
 * @returns string HTML string with script contents wrapped in <script /> tag.
 */
function renderScript(name, script) {
  if (typeof script !== 'string') {
    return '';
  }

  return `<script id="ima-${name}">${script}</script>`;
}

/**
 * Prepares default $Source object structure assembled
 * from the built manifest.json file.
 *
 * @param manifest Contents of manifest.json from ./build folder.
 * @param language Current response language code.
 * @returns object Object with app resources definition.
 */
function _prepareSources(manifest, language) {
  const { assetsByCompiler, assets, publicPath } = manifest;
  const buildResources = (name, sourceFilter, attr = {}) => {
    if (!assetsByCompiler?.[name]) {
      return [];
    }

    // Filter unwanted assets and use only current language
    const assetsData = Object.values(assetsByCompiler[name]);
    const filteredAssets = assetsData.filter(sourceFilter);

    // Resolve asset names to actual filenames
    return filteredAssets.map(asset => {
      const assetFile = assets[asset.name]?.fileName;

      // Add CDN as primary source with static file as fallback
      if (process.env.IMA_PUBLIC_PATH) {
        return [
          `${process.env.IMA_PUBLIC_PATH}${assetFile}`,
          {
            ...attr,
            fallback: publicPath + assetFile,
          },
        ];
      }

      return [publicPath + assetFile, attr];
    });
  };

  // Filter out specific assets for each source entry
  const cssFilter = ({ name }) => name.endsWith('.css');
  const jsFilter = ({ name }) =>
    (name.endsWith('.js') && !name.includes('/locale/')) ||
    name.includes(`locale/${language}.js`);

  return {
    styles: buildResources('client', cssFilter, {
      rel: 'stylesheet',
      preload: true,
    }),
    scripts: buildResources('client', jsFilter, {
      async: true,
      crossorigin: 'anonymous',
    }),
    esStyles: buildResources('client.es', cssFilter, {
      rel: 'stylesheet',
      preload: true,
    }),
    esScripts: buildResources('client.es', jsFilter, {
      async: true,
      crossorigin: 'anonymous',
    }),
  };
}

/**
 * Memoized version of _prepareSources function.
 *
 * @param manifest Contents of manifest.json from ./build folder.
 * @param language Current response language code.
 * @returns object Object with app resources definition.
 */
const prepareDefaultResources = memoizeOne((manifest, language) =>
  _prepareSources(manifest, language)
);

module.exports = {
  prepareDefaultResources,
  _prepareSources,
  renderStyles,
  renderScript,
};
