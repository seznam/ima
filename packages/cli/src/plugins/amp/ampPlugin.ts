import { CommandBuilder } from 'yargs';
import path from 'path';
import fg from 'fast-glob';
import postcss from 'postcss';
import PostCssPipelineWebpackPlugin from 'postcss-pipeline-webpack-plugin';

import { ConfigurationContext, CliArgs } from '../../types';
import { Configuration, EntryObject } from 'webpack';
import { ImaCliCommand, ImaCliPlugin } from '../..';

export interface AmpPluginConfigurationContext extends ConfigurationContext {
  amp?: boolean;
}

export interface AmpPluginOptions {
  enabled?: boolean;
  entry: string[];
  postCssPlugins?: [];
  outputDir?: string;
}

/**
 * Generate entry points for provided glob paths.
 *
 * @param {CliArgs['rootDir']} rootDir App root directory.
 * @param {string[]=[]} paths Globs of less/css files.
 * @param {string} [prefix=''] Output filename prefix.
 * @returns {Promise<Record<string, string>>} Array of entry
 *          points file paths.
 */
async function generateEntryPoints(
  rootDir: CliArgs['rootDir'],
  paths: string[] = [],
  prefix = ''
): Promise<Record<string, string>> {
  const resolvedPaths = await fg(
    paths.map(globPath => path.join(rootDir, globPath))
  );

  return resolvedPaths.reduce((acc: Record<string, string>, cur) => {
    let entryPoint = path.join(prefix, cur.replace(`${rootDir}/`, ''));

    const extensionIndex = entryPoint.lastIndexOf('.');
    entryPoint = entryPoint.substring(0, extensionIndex);

    acc[entryPoint] = cur;

    return acc;
  }, {});
}

/**
 * Plugin additional CLI args, amp option can be used to explicitly enable/disable
 * generation of amp files.
 */
const ampPluginSharedCliArgs: CommandBuilder = {
  amp: {
    desc: 'Builds separate CSS files for use in AMP mode',
    type: 'boolean'
  }
};

/**
 * Generates css file per component, so it can be later used to dynamically
 * construct minimal css file need to render the page (used specifically for AMP).
 */
export default class AmpPlugin
  implements ImaCliPlugin<AmpPluginConfigurationContext> {
  private _options: AmpPluginOptions;

  readonly name = 'amp-plugin';
  readonly cliArgs: Partial<Record<ImaCliCommand, CommandBuilder>> = {
    build: ampPluginSharedCliArgs,
    dev: ampPluginSharedCliArgs
  };

  constructor(options: AmpPluginOptions) {
    this._options = options;
  }

  async webpack(
    config: Configuration,
    ctx: AmpPluginConfigurationContext
  ): Promise<Configuration> {
    const { rootDir, isServer } = ctx;

    if (!isServer && (ctx.amp ?? this._options?.enabled)) {
      if (
        !Array.isArray(this._options?.entry) ||
        this._options?.entry.length === 0
      ) {
        throw new Error(
          `amp-plugin: 'entry' field in amp-plugin is either empty or undefined, it ` +
            `must be an array of glob paths in order to correctly generate amp css files.`
        );
      }

      // AMP specific entry points
      config.entry = {
        ...(config.entry as EntryObject),
        ...(await generateEntryPoints(
          rootDir,
          this._options?.entry,
          this._options?.outputDir
        ))
      };

      // Custom AMP postcss
      if (
        Array.isArray(this._options?.postCssPlugins) &&
        this._options?.postCssPlugins.length !== 0
      ) {
        config.plugins?.push(
          new PostCssPipelineWebpackPlugin({
            predicate: (name: string) =>
              !/static\/css\/app.css$/.test(name) &&
              !/srambled.css$/.test(name),
            processor: postcss(this._options?.postCssPlugins)
          })
        );
      }
    }

    return config;
  }
}
