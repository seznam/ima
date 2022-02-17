// TODO remove plugin specific dependencies form cli package.json

import path from 'path';

import globby from 'globby';
import { Configuration, EntryObject } from 'webpack';
import { CommandBuilder } from 'yargs';

import { createLogger } from '../../lib/logger';
import {
  ImaConfigurationContext,
  ImaCliCommand,
  ImaCliPlugin,
} from '../../types';
import { PostCssPlugin } from '../../webpack/plugins/PostCssPlugin';

// Extend existing cli args interface with new values
declare module '../../types' {
  interface ImaCliArgs {
    amp?: boolean;
  }
}

export interface AmpPluginOptions {
  entry: string[];
  postCssPlugins?: [];
  filter?: (filename: string) => boolean;
  transform?: (outputPath: string) => string;
}

/**
 * Plugin additional CLI args, amp option can be used to explicitly enable/disable
 * generation of amp files. Enabled by default for build command.
 */
const ampPluginSharedCliArgs: CommandBuilder = {
  amp: {
    desc: 'Builds separate CSS files for use in AMP mode',
    type: 'boolean',
  },
};

/**
 * Generates css file per component, so it can be later used to dynamically
 * construct minimal css file need to render the page (used specifically for AMP).
 */
// TODO RemoveEmptyScripts doesnt work for new entry points since @pmmmwh/react-refresh-webpack-plugin injects
// custom JS entries and RemoveEmptyScripts now thinks that these empty JS entries are only used in the CSS so it does not remove them
class AmpPlugin implements ImaCliPlugin {
  private _options: Required<AmpPluginOptions>;
  private _logger: ReturnType<typeof createLogger>;

  readonly name = 'AmpPlugin';
  readonly cliArgs: Partial<Record<ImaCliCommand, CommandBuilder>> = {
    build: ampPluginSharedCliArgs,
    dev: ampPluginSharedCliArgs,
  };

  constructor(options: AmpPluginOptions) {
    this._logger = createLogger(this);

    // Init options with defaults
    this._options = {
      filter: () => true,
      postCssPlugins: [],
      transform: outputPath => {
        if (!outputPath.startsWith('node_modules')) {
          return outputPath;
        }

        // Special handling for ima-plugin-atoms
        if (outputPath.includes('@ima/plugin-atoms')) {
          return 'ima-plugin-atoms/ima-plugin-atoms';
        }

        // Cleanup and normalize node_module paths
        outputPath = outputPath.replace('dist/', '');
        outputPath = outputPath.replace(
          /node_modules\/(@ima|@usa|@cns)\/plugin-/gi,
          'plugin/'
        );

        // Convert path from dash-case to camelCase
        outputPath = outputPath
          .split('/')
          .map(pathPart =>
            pathPart.replace(/-([a-z])/g, g => g[1].toUpperCase())
          )
          .join('/');

        return outputPath;
      },
      ...options,
    };
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext
  ): Promise<Configuration> {
    // Process AMP only in context which processes CSS files
    if (!ctx.processCss) {
      return config;
    }

    // Continue for build command or explicit CLI arg otherwise bail
    if (!(ctx.command === 'build' || ctx.amp)) {
      return config;
    }

    if (
      !Array.isArray(this._options?.entry) ||
      this._options?.entry.length === 0
    ) {
      this._logger.error(
        `'entry' field in amp-plugin is either empty or undefined, it ` +
          `must be an array of glob paths in order to correctly generate amp css files.`
      );
      process.exit(1);
    }

    // AMP specific entry points
    const ampEntries = await this._generateEntries(ctx.rootDir);
    const ampEntryPaths = Object.keys(ampEntries);
    config.entry = {
      ...(config.entry as EntryObject),
      ...ampEntries,
    };

    // Custom AMP specific postcss
    if (this._options.postCssPlugins.length > 0) {
      config.plugins?.push(
        new PostCssPlugin({
          plugins: this._options.postCssPlugins,
          // Apply postcss only to newly added entry points
          filter: (name: string) => {
            return ampEntryPaths.some(entryPath => name.includes(entryPath));
          },
        })
      );
    }

    return config;
  }

  /**
   * Generate entry points for provided glob paths.
   */
  private async _generateEntries(
    rootDir: string
  ): Promise<Record<string, string>> {
    const resolvedPaths = await globby(
      this._options?.entry.map(globPath => path.join(rootDir, globPath))
    );

    return resolvedPaths
      .filter(this._options.filter)
      .reduce((acc: Record<string, string>, cur) => {
        let entryPoint = cur.replace(`${rootDir}/`, '');

        // Remove extension
        entryPoint = entryPoint.substring(0, entryPoint.lastIndexOf('.'));

        // Run custom transform function
        entryPoint = this._options.transform(entryPoint);

        acc[entryPoint] = cur;

        return acc;
      }, {});
  }
}

export { AmpPlugin };
