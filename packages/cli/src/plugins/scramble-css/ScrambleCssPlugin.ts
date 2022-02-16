// TODO remove plugin specific dependencies form cli package.json

import fs from 'fs';
import path from 'path';

import { Configuration } from 'webpack';
import { CommandBuilder } from 'yargs';

import { ImaCliPlugin, ImaConfigurationContext } from '../../types';
import {
  ScrambleCssMinimizerOptions,
  ScrambleCssMinimizer,
} from './plugin/ScrambleCssMinimizer';

// Extend existing cli args interface with new values
declare module '../../types' {
  interface ImaCliArgs {
    scrambleCss?: boolean;
  }
}

export interface ScrambleCssPluginOptions {
  scrambleCssMinimizerOptions?: ScrambleCssMinimizerOptions;
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

  constructor(options: Partial<ScrambleCssPluginOptions> = {}) {
    this._options = options;
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext
  ): Promise<Configuration> {
    // Set default hash table filename (path)
    if (
      !this._options.scrambleCssMinimizerOptions?.hashTableFilename ||
      !path.isAbsolute(
        this._options.scrambleCssMinimizerOptions?.hashTableFilename
      )
    ) {
      const { hashTableFilename } =
        this._options.scrambleCssMinimizerOptions || {};

      // Set absolute hash table path
      const hashTablePath =
        hashTableFilename && path.isAbsolute(hashTableFilename)
          ? hashTableFilename
          : path.join(
              config?.output?.path ?? process.cwd(),
              hashTableFilename ?? 'static/css/hashTable.json'
            );

      // Update plugin options
      this._options = {
        ...this._options,
        scrambleCssMinimizerOptions: {
          ...this._options?.scrambleCssMinimizerOptions,
          hashTableFilename: hashTablePath,
        },
      };
    }

    // Init minimizer
    const scrambleCssMinimizer = new ScrambleCssMinimizer(
      this._options?.scrambleCssMinimizerOptions
    );

    // TODO known bug, if run in dev mode, the app needs to save CSS
    // again to trigger re-built and have correct css.
    /**
     * Force minimizer in development if CLI argument is present.
     * This will remove all other minimizers except the CSS scrambler
     * and force minimization in dev mode.
     */
    if (ctx.scrambleCss) {
      config.optimization = {
        ...config.optimization,
        minimize: !ctx.isServer,
        minimizer: [scrambleCssMinimizer],
      };
    } else {
      /**
       * Remove existing hashTable.json so the web does not try
       * to load with scrambled CSS.
       */
      if (
        this._options.scrambleCssMinimizerOptions?.hashTableFilename &&
        fs.existsSync(
          this._options.scrambleCssMinimizerOptions?.hashTableFilename
        )
      ) {
        await fs.promises.rm(
          this._options.scrambleCssMinimizerOptions?.hashTableFilename
        );
      }
      // Add new scrambleCSS minimizer
      config.optimization?.minimizer?.unshift(scrambleCssMinimizer);
    }

    return config;
  }
}

export { ScrambleCssPlugin };
