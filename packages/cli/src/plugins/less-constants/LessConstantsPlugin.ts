// TODO IMA@18 remove plugin specific dependencies form cli package.json

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import webpack from 'webpack';

import { createLogger } from '../../lib/logger';
import { ImaCliPlugin, ImaCliArgs, ImaConfig } from '../../types';
import { generateLessVariables, UnitValue } from './generator';

export interface LessConstantsPluginOptions {
  entry: string;
  output?: string;
}

/**
 * Generates .less file with less variables created from JS entry point.
 * The entry point should consist of default export of an object
 * with key values composed of LessConstantsPlugin helper functions.
 */
class LessConstantsPlugin implements ImaCliPlugin {
  private _options: LessConstantsPluginOptions;
  private _logger: ReturnType<typeof createLogger>;

  readonly name = 'LessConstantsPlugin';

  constructor(options: LessConstantsPluginOptions) {
    this._options = options || {};
    this._logger = createLogger(this);
  }

  /**
   * We'll generate less variables files in the preProcess hook, in order
   * for it to be usable as an import in globals.less file.
   */
  async preProcess(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void> {
    if (!this._options.entry) {
      this._logger.error('closing compiler... entry file was not provided.');

      process.exit(1);
    }

    let outputPath = '';
    const { entry } = this._options;
    const entryPath = path.isAbsolute(entry)
      ? entry
      : path.resolve(args.rootDir, entry);

    if (!fs.existsSync(entryPath)) {
      this._logger.error(`entry file at path '${entryPath}' doesn't exist.`);

      process.exit(1);
    }

    // Print output info
    this._logger.plugin(`Processing ${chalk.magenta(entry)} file..`, {
      trackTime: true,
    });

    try {
      // Generate less variables from entry module
      const lessConstants = generateLessVariables(
        await this._compileEntry(entryPath, args, imaConfig)
      );

      // Write generated less file to filesystem
      outputPath =
        this._options.output ??
        path.join(args.rootDir, 'build/less-constants/constants.less');

      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(outputPath, lessConstants, {
        encoding: 'utf8',
      });
    } catch (error) {
      this._logger.error(error instanceof Error ? error : 'unknown error');
      process.exit(1);
    }

    // Print output info
    this._logger.plugin(
      `generated: ${chalk.magenta(outputPath.replace(args.rootDir, '.'))}`
    );
  }

  /**
   * Runs entry file through webpack to bypass esm/cjs compatibility issues
   * and generate one nodeJS compatible file, which can be imported and further procesed.
   * Additionally this works with custom defined webpack aliases in ima config.
   */
  private async _compileEntry(
    modulePath: string,
    args: ImaCliArgs,
    imaConfig: ImaConfig
  ): Promise<Record<string, UnitValue>> {
    const outputDir = path.join(
      args.rootDir,
      './node_modules/.cache/less-constants-plugin'
    );

    // Compile entry point with webpack
    return new Promise((resolve, reject) => {
      webpack(
        {
          target: 'node18',
          mode: 'none',
          output: {
            path: outputDir,
            libraryTarget: 'commonjs2',
          },
          entry: { lessConstantsEntry: modulePath },
          module: {
            rules: [
              {
                /**
                 * Allow interop import of .mjs modules.
                 */
                test: /\.mjs$/,
                type: 'javascript/auto',
                resolve: {
                  fullySpecified: false,
                },
              },
            ],
          },
          resolve: {
            alias: {
              app: path.join(args.rootDir, 'app'),
              ...imaConfig.webpackAliases,
            },
          },
          cache: {
            name: 'less-constants-plugin',
            type: 'filesystem',
          },
          optimization: {
            moduleIds: 'named',
            chunkIds: 'named',
            splitChunks: {
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                },
              },
            },
          },
          plugins: [
            new webpack.DefinePlugin({
              $Debug: false,
            }),
          ],
        },
        err => {
          if (err) {
            reject(err);
          }

          // Require generated bundle
          resolve(
            import(path.join(outputDir, '/lessConstantsEntry.js')).then(
              module => module.default
            )
          );
        }
      );
    });
  }
}

export { LessConstantsPlugin };
