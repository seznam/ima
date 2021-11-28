import { CommandBuilder } from 'yargs';
import path from 'path';
import fg from 'fast-glob';
import postcss from 'postcss';
import PostCssPipelineWebpackPlugin from 'postcss-pipeline-webpack-plugin';

import { ImaCliPluginFactory, ConfigurationContext, Args } from '../../types';
import { EntryObject } from 'webpack';

// TODO not good?
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
 * @param {Args['rootDir']} rootDir App root directory.
 * @param {string[]=[]} paths Globs of less/css files.
 * @param {string} [prefix=''] Output filename prefix.
 * @returns {Promise<Record<string, string>>} Array of entry
 *          points file paths.
 */
async function generateEntryPoints(
  rootDir: Args['rootDir'],
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
 *
 * @param {AmpPluginOptions} Plugin build options.
 * @returns {ImaCliPlugin} Cli plugin definition.
 */
const AmpPlugin: ImaCliPluginFactory<AmpPluginOptions> = options => ({
  name: 'amp-plugin',
  cliArgs: {
    build: ampPluginSharedCliArgs,
    dev: ampPluginSharedCliArgs
  },
  webpack: async (config, ctx: AmpPluginConfigurationContext) => {
    const { rootDir, isServer } = ctx;

    if (!isServer && (ctx.amp ?? options?.enabled)) {
      if (!Array.isArray(options?.entry) || options?.entry.length === 0) {
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
          options?.entry,
          options?.outputDir
        ))
      };

      // Custom AMP postcss
      if (
        Array.isArray(options?.postCssPlugins) &&
        options?.postCssPlugins.length !== 0
      ) {
        config.plugins?.push(
          new PostCssPipelineWebpackPlugin({
            predicate: (name: string) =>
              !/static\/css\/app.css$/.test(name) &&
              !/srambled.css$/.test(name),
            processor: postcss(options?.postCssPlugins)
          })
        );
      }
    }

    return config;
  }
});

export default AmpPlugin;
