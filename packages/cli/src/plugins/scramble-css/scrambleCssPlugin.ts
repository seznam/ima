import { CommandBuilder } from 'yargs';
import path from 'path';
import postcss from 'postcss';
import PostCssPipelineWebpackPlugin from 'postcss-pipeline-webpack-plugin';

import postCssScrambler from './postCssScrambler';
import { ImaCliPluginFactory, ConfigurationContext } from '../../types';

export interface ScrambleCssPluginConfigurationContext
  extends ConfigurationContext {
  scrambleCss?: boolean;
}

export interface ScrambleCssPluginOptions {
  enabled?: boolean;
  suffix?: string;
  generateHashTable?: boolean;
  hashTableLocation?: string;
  uniqueIdentifier?: string;
}

// TODO extract to separate npm package
/**
 * Plugin additional CLI args, scrambleCss option can be used to explicitly enable/disable
 * scrambling for certain use cases.
 */
const scrambleCssPluginSharedCliArgs: CommandBuilder = {
  scrambleCss: {
    desc: 'Scrambles (uglifies) classNames in css files',
    type: 'boolean'
  }
};

/**
 * Minifies component classnames and generates hashtable of transformed classnames
 * which can be later used for backwards translation.
 *
 * @param {ScrambleCssPluginOptions} Plugin build options.
 * @returns {ImaCliPlugin} Cli plugin definition.
 */
const ScrambleCssPlugin: ImaCliPluginFactory<ScrambleCssPluginOptions> = options => ({
  name: 'scramble-css-plugin',
  cliArgs: {
    build: scrambleCssPluginSharedCliArgs,
    dev: scrambleCssPluginSharedCliArgs
  },
  webpack: async (config, ctx: ScrambleCssPluginConfigurationContext) => {
    const { rootDir, isServer } = ctx;
    const packageJsonPath = path.resolve(rootDir, './package.json');
    const packageJson = packageJsonPath ? require(packageJsonPath) : {};

    // Defaults
    const suffix = options?.suffix ?? 'srambled';
    const uniqueIdentifier =
      options?.uniqueIdentifier ?? `${packageJson.name}:${packageJson.version}`;
    const hashTable =
      options?.hashTableLocation ??
      path.join(rootDir, 'build/static/hashtable.json');

    // Run CSS scrambler, this needs to run on generated assets
    if (!isServer && (ctx.scrambleCss ?? options?.enabled)) {
      // Scramble only app css and generate hashtable
      config.plugins?.push(
        new PostCssPipelineWebpackPlugin({
          suffix,
          predicate: (name: string) => /static\/css\/app.css$/.test(name),
          processor: postcss([
            postCssScrambler({
              generateHashTable: options?.generateHashTable ?? true,
              uniqueIdentifier,
              hashTable
            })
          ])
        })
      );

      // Scramble other entry points with already generated hashtable
      config.plugins?.push(
        new PostCssPipelineWebpackPlugin({
          suffix,
          predicate: (name: string) =>
            !/static\/css\/app.css$/.test(name) && !/srambled.css$/.test(name),
          processor: postcss([
            postCssScrambler({
              generateHashTable: false,
              hashTable
            })
          ])
        })
      );
    }

    return config;
  }
});

export default ScrambleCssPlugin;
