// TODO remove plugin specific dependencies form cli package.json

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
    // Add ScrambleCssMinimizer for the correct context
    if (ctx.isEsVersion && !ctx.forceSPAWithHMR) {
      config.optimization?.minimizer?.unshift(
        new ScrambleCssMinimizer(this._options?.scrambleCssMinimizerOptions)
      );
    }

    return config;
  }
}

export { ScrambleCssPlugin };
