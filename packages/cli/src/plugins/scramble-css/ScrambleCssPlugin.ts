// TODO remove plugin specific dependencies form cli package.json

import path from 'path';

import postcss from 'postcss';
import PostCssPipelineWebpackPlugin from 'postcss-pipeline-webpack-plugin';
import { Configuration } from 'webpack';
import { CommandBuilder } from 'yargs';

import { ImaCliPlugin, ImaConfigurationContext } from '../../types';
import postCssScrambler from './postCssScrambler';

// Extend existing cli args interface with new values
declare module '../../types' {
  interface ImaCliArgs {
    scrambleCss?: boolean;
  }
}

export interface ScrambleCssPluginOptions {
  enabled?: boolean;
  uniqueIdentifier?: string;
  generateHashTable?: boolean;
  hashTableOutput?: string;
}

/**
 * Plugin additional CLI args, scrambleCss option can be used to explicitly enable/disable
 * scrambling for certain use cases.
 */
const scrambleCssPluginSharedCliArgs: CommandBuilder = {
  scrambleCss: {
    desc: 'Scrambles (uglifies) classNames in css files',
    type: 'boolean',
  },
};

/**
 * Minifies component classnames and generates hashtable of transformed classnames
 * which can be later used for backwards translation.
 */
class ScrambleCssPlugin implements ImaCliPlugin {
  private _options: ScrambleCssPluginOptions;

  readonly name = 'ScrambleCssPlugin';
  readonly cliArgs = {
    build: scrambleCssPluginSharedCliArgs,
    dev: scrambleCssPluginSharedCliArgs,
  };

  constructor(options: Partial<ScrambleCssPluginOptions>) {
    this._options = options;
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext
  ): Promise<Configuration> {
    const { rootDir, isServer } = ctx;
    const hashTable =
      this._options?.hashTableOutput ??
      path.join(rootDir, 'build/static/hashtable.json');

    // Run CSS scrambler, this needs to run on generated assets
    if (!isServer && (ctx.scrambleCss ?? this._options?.enabled)) {
      // Scramble only app css and generate hashtable
      config.plugins?.push(
        new PostCssPipelineWebpackPlugin({
          predicate: (name: string) => /static\/css\/app.css$/.test(name),
          processor: postcss([
            postCssScrambler({
              generateHashTable: this._options?.generateHashTable ?? true,
              uniqueIdentifier: this._options.uniqueIdentifier,
              hashTable,
            }),
          ]),
        })
      );

      // Scramble other entry points with already generated hashtable
      // config.plugins?.push(
      //   new PostCssPipelineWebpackPlugin({
      //     predicate: (name: string) =>
      //       !/static\/css\/app.css$/.test(name) && !/srambled.css$/.test(name),
      //     processor: postcss([
      //       postCssScrambler({
      //         generateHashTable: false,
      //         hashTable,
      //       }),
      //     ]),
      //   })
      // );
    }

    return config;
  }
}

export { ScrambleCssPlugin };
