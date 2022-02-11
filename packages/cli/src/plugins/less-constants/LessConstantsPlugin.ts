import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import webpack from 'webpack';

import * as logger from '../../lib/logger';
import { time } from '../../lib/time';
import { ImaCliPlugin, ImaCliArgs, ImaConfig } from '../../types';

export interface LessConstantsPluginOptions {
  entry: string;
  output?: string;
}

/**
 * Generates .less file with less variables created from JS entry point.
 * The entry point should be composed of default export of an object
 * with key values composed of LessConstantsPlugin helper functions.
 */
class LessConstantsPlugin implements ImaCliPlugin {
  private _options: LessConstantsPluginOptions;

  readonly name = 'LessConstantsPlugin';

  constructor(options: LessConstantsPluginOptions) {
    this._options = options || {};
  }

  async preProcess(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void> {
    const elapsed = time();

    if (!this._options.entry) {
      return logger.error(
        `${chalk.underline(
          'LessConstantsPlugin'
        )}: bailing... entry file was not provided.`
      );
    }

    let outputPath = '';
    const { entry } = this._options;
    const entryPath = path.isAbsolute(entry)
      ? entry
      : path.resolve(args.rootDir, entry);

    if (!fs.existsSync(entryPath)) {
      return logger.error(
        `${chalk.underline(
          'LessConstantsPlugin'
        )}: entry file at path '${entryPath}' doesn't exist.`
      );
    }

    try {
      const entryModule = await this._compileEntry(entryPath, args, imaConfig);
      const lessConstants = Object.keys(entryModule)
        .map(key => {
          return this._process(
            key,
            entryModule[key] as Record<string, unknown> | string
          );
        })
        .join('');

      // Write generated less file
      outputPath =
        this._options.output ??
        path.join(args.rootDir, 'build/less-constants/constants.less');

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(
        outputPath,
        `// This file was automatically generated using LessConstantsPlugin\n\n${lessConstants}`,
        'utf-8'
      );
    } catch (error) {
      return logger.error(
        `${chalk.underline('LessConstantsPlugin')}: ${
          error instanceof Error
            ? `${error.toString()}\n\n${error.stack}`
            : 'unknown error'
        }`
      );
    }

    logger.plugin(
      `${chalk.underline('LessConstantsPlugin')}: generated: ${chalk.magenta(
        outputPath.replace(args.rootDir, '.')
      )}`,
      false
    );
    logger.write(chalk.gray(` [${elapsed()}]`));
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
  ): Promise<Record<string, unknown>> {
    const outputDir = path.join(
      args.rootDir,
      './node_modules/.cache/ima-cli/less-constants-plugin'
    );

    // Create tmp directory, if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    // Compile entry point with webpack
    return new Promise((resolve, reject) => {
      webpack(
        {
          target: 'node16',
          mode: 'none',
          output: {
            path: outputDir,
            libraryTarget: 'commonjs2',
          },
          entry: { lessConstantsEntry: modulePath },
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

          resolve(
            import(path.join(outputDir, '/lessConstantsEntry.js')).then(
              module => module.default
            )
          );
        }
      );
    });
  }

  private _process(
    property: string,
    value: Record<string, unknown> | string,
    prefix = '@'
  ): string {
    const subPrefix = this.getSubPrefix(property, prefix);

    // if (value instanceof Object && value.__lessMap) {
    //   return `${subPrefix}: {\n${value.toString()}}\n`;
    // }

    if (value instanceof Object && !value.__propertyDeclaration) {
      return (
        Object.keys(value)
          .map((subProperty: string) =>
            this._process(
              subProperty,
              value[subProperty] as Record<string, unknown> | string,
              subPrefix
            )
          )
          .join('') + '\n'
      ); // add extra empty line after a group of properties
    }

    return `${subPrefix}: ${value.toString()};\n`;
  }

  private getSubPrefix(property: string, prefix: string): string {
    return prefix + (prefix.length > 1 ? '-' : '') + this.slugify(property);
  }

  private slugify(label: string): string {
    let result = '';

    for (let i = 0; i < label.length; i++) {
      const char = label.substring(i, i + 1);
      if (i && !/-|\d/.test(char) && char.toUpperCase() === char) {
        result += `-${char.toLowerCase()}`;
      } else {
        result += char;
      }
    }

    return result;
  }
}

export { LessConstantsPlugin };
