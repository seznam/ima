import { Plugin } from 'vite';

type ImaSkipCssPluginOptions = {
    environments?: string[];
}

/**
 * Plugin to prevent CSS file emission in selected environments
 */
export function imaSkipCssPlugin(options: ImaSkipCssPluginOptions = {}): Plugin {
  return {
    name: 'ima:skip-css',
    enforce: 'post',
    applyToEnvironment(environment) {
      return !options.environments || options.environments.includes(environment.name);
    },
    generateBundle(options, bundle) {
      // Remove all CSS assets from the bundle
      Object.keys(bundle).forEach(fileName => {
        if (fileName.endsWith('.css')) {
          delete bundle[fileName];
        }
      });
    }
  };
}
