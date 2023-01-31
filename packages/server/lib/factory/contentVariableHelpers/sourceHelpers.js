/**
 * Prepares default $Source object structure assembled
 * from the built manifest.json file.
 */
function _prepareSource({ assetsByCompiler, assets, publicPath }, language) {
  const buildSource = (name, sourceFilter, attr = {}) => {
    if (!assetsByCompiler?.[name]) {
      return [];
    }

    // Filter unwanted assets and use only current language
    const assetsData = Object.values(assetsByCompiler[name]);
    const filteredAssets = assetsData.filter(sourceFilter);

    // Resolve asset names to actual filenames
    return filteredAssets.map(asset => {
      const assetFile = assets[asset.name]?.fileName;

      if (!process.env.CDN_STATIC_ROOT_URL) {
        return [publicPath + assetFile, attr];
      }

      // Add CDN as primary source with static file as fallback
      return [
        `${process.env.CDN_STATIC_ROOT_URL}${assetFile}`,
        {
          ...attr,
          fallback: publicPath + assetFile,
        },
      ];
    });
  };

  // Filter out specific assets for each source entry
  const cssFilter = ({ name }) => name.endsWith('.css');
  const jsFilter = ({ name }) =>
    (name.endsWith('.js') && !name.includes('/locale/')) ||
    name.includes(`locale/${language}.js`);

  return {
    styles: buildSource('client.es', cssFilter, {
      rel: 'stylesheet',
      preload: true,
    }),
    scripts: buildSource('client', jsFilter, {
      async: true,
      crossorigin: 'anonymous',
    }),
    esScripts: buildSource('client.es', jsFilter, {
      async: true,
      crossorigin: 'anonymous',
    }),
  };
}

function _renderStyles(styles) {
  return (Array.isArray(styles) ? styles : [styles]).reduce((acc, cur) => {
    if (typeof cur === 'string') {
      acc += `<link rel="stylesheet" href="${cur}" />`;

      return acc;
    }

    const [href, { fallback = null, preload, rel = 'stylesheet', ...options }] =
      cur;
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
  }, '');
}

function _renderScript(name, script) {
  if (!script) {
    return '';
  }

  return `<script id="ima-${name}">${script}</script>`;
}

module.exports = {
  _prepareSource,
  _renderStyles,
  _renderScript,
};
