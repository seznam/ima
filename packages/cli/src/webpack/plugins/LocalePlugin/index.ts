import fs from 'fs';
import path from 'path';

import MessageFormat from '@messageformat/core';
import compileModule, {
  StringStructure,
} from '@messageformat/core/lib/compile-module';
import globby from 'globby';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import { Compilation, Compiler, sources, WebpackError } from 'webpack';

import { ImaConfig, ImaConfigurationContext } from '../../../types';

import schema from './options.json';

export interface GenerateRunnerPluginOptions {
  context: ImaConfigurationContext;
  imaConfig: ImaConfig;
}

/**
 * This plugin takes care of generating application runtime script
 * consisting of @ima/core runner polyfill implementation embedded
 * with the webpack runtime execution code.
 */
class LocalePlugin {
  #pluginName: string;
  #languages: Record<string, string[]>;
  #options: GenerateRunnerPluginOptions;

  constructor(options: GenerateRunnerPluginOptions) {
    this.#pluginName = this.constructor.name;
    this.#options = options;

    // Validate options
    validate(schema as Schema, this.#options, {
      name: this.#pluginName,
      baseDataPath: 'options',
    });

    this.#languages = {};

    // Resolve languages paths
    for (const [language, languageGlobPaths] of Object.entries(
      options.imaConfig.languages
    )) {
      this.#languages[language] = globby.sync(languageGlobPaths, {
        cwd: this.#options.context.rootDir,
        absolute: true,
      });
    }
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this.#pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this.#pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets: Compilation['assets']) => this.generate(assets, compilation)
      );
    });
  }

  /**
   * Generate runner code from compiled assets.
   */
  async generate(
    assets: Compilation['assets'],
    compilation: Compilation
  ): Promise<void> {
    // Add compilation file dependencies
    for (const [locale, languagePaths] of Object.entries(this.#languages)) {
      compilation.fileDependencies.addAll(languagePaths);

      // Compile language modules
      const mf = new MessageFormat(locale);
      const compiledModule = compileModule(
        mf,
        await this.#mergeLanguageFiles(compilation, locale, languagePaths)
      );

      console.log('ADDING');

      // compilation.addEntry(
      //   `static/locale/${locale}.js`,
      //   ,
      //   `${locale}.js`,
      //   (err, result) => {
      //     console.log('test', err, result);
      //   }
      // );
      console.log('ADDING');

      compilation.emitAsset(
        `static/locale/${locale}.js`,
        new sources.RawSource(compiledModule)
      );
    }
  }

  async #mergeLanguageFiles(
    compilation: Compilation,
    locale: string,
    languagePaths: string[]
  ): Promise<StringStructure> {
    const languageStrings: StringStructure = {};

    for (const languagePath of languagePaths) {
      try {
        const dictionaryKey = path
          .parse(languagePath)
          .name.replace(locale.toUpperCase(), '');
        const contents = JSON.parse(
          await (await fs.promises.readFile(languagePath)).toString()
        ) as unknown as StringStructure;

        // TODO deepmerge
        // Merge language file contents into one object.
        languageStrings[dictionaryKey] = {
          ...(languageStrings[dictionaryKey] as unknown as object),
          contents,
        };
      } catch (error) {
        compilation.errors.push(error as WebpackError);
      }
    }

    return languageStrings;
  }
}

export { LocalePlugin };
