// TODO IMA@18 remove plugin specific dependencies form cli package.json

import fs from 'fs';
import path from 'path';

import { Configuration } from 'webpack';
import { CommandBuilder } from 'yargs';

import { ImaCliArgs, ImaCliPlugin, ImaConfigurationContext } from '../../types';
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

function createCliArgs(command: ImaCliArgs['command']): CommandBuilder {
  return {
    scrambleCss: {
      desc: 'Scrambles (uglifies) classNames in css files',
      type: 'boolean',
      default: command === 'build',
    },
  };
}

/**
 * Minifies component classnames and generates hashtable of transformed classnames
 * which can be later used for backwards translation.
 */
class ScrambleCssPlugin implements ImaCliPlugin {
  private _options: ScrambleCssPluginOptions;

  readonly name = 'ScrambleCssPlugin';
  readonly cliArgs = {
    build: createCliArgs('build'),
    dev: createCliArgs('dev'),
  };

  constructor(options: Partial<ScrambleCssPluginOptions> = {}) {
    this._options = options;
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext
  ): Promise<Configuration> {
    // Add only in css processing context
    if (!ctx.processCss) {
      return config;
    }

    /**
     * Set plugin default options. We need to do this here, rather than in
     * the constructor since we have to have access to the `config.output.path`.
     */
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

    /**
     * Remove existing hashTable.json so the web does not try
     * to load css with invalid scrambled CSS.
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

    if (ctx.scrambleCss) {
      if (ctx.command === 'dev') {
        /**
         * Force minimizer in development if CLI argument is present.
         * This will remove all other minimizers except the CSS scrambler
         * and force minimization in dev mode.
         */
        config.optimization = {
          ...config.optimization,
          minimize: !ctx.isServer,
          minimizer: [scrambleCssMinimizer],
        };
      } else {
        /**
         * Enable minimizer by default during build, but allow it
         * to be disabled explicitly using the CLI arg.
         */
        config.optimization?.minimizer?.unshift(scrambleCssMinimizer);
      }
    }

    return config;
  }
}

export { ScrambleCssPlugin };
