import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import { assignRecursively } from '@ima/helpers';
import MessageFormat from '@messageformat/core';
import compileModule, {
  StringStructure,
} from '@messageformat/core/lib/compile-module';
import chalk from 'chalk';
import chokidar from 'chokidar';
import globby from 'globby';

import { ImaConfig } from '../types';

const TMP_BASEPATH = './build/tmp';

/**
 * Returns path to location of compiled messageformat JS modules
 * for given locale.
 *
 * @param locale Currently processed locale identifier.
 * @param rootDir Current compilation root directory.
 * @returns Path to compiled locale module.
 */
export function getLanguageModulePath(locale: string, rootDir: string) {
  return path.join(rootDir, TMP_BASEPATH, `/locale/${locale}.module.js`);
}

/**
 * Returns path to location of compiled messageformat JS modules
 * for given locale.
 *
 * @param locale Currently processed locale identifier.
 * @param rootDir Current compilation root directory.
 * @returns Path to compiled locale module.
 */
export function getLanguageEntryPath(locale: string, rootDir: string) {
  return path.join(rootDir, TMP_BASEPATH, `/locale/${locale}.js`);
}

/**
 * Parses dictionary key from given filename and locale identifier.
 *
 * @param locale Currently processed locale identifier.
 * @param languagePath Path to currently processed JSON language file.
 * @returns Parsed dictionary key.
 */
export function getDictionaryKeyFromFileName(
  locale: string,
  languagePath: string
) {
  return path.parse(languagePath).name.replace(locale.toUpperCase(), '');
}

/**
 * Returns entry points to use in webpack configurations. These then lead to
 * messageformat compiled modules while also containing some additional runtime code.
 *
 * @param languages Languages object from ima config.
 * @param rootDir Current compilation root directory.
 * @returns Object with webpack entry points.
 */
export function getLanguageEntryPoints(
  languages: ImaConfig['languages'],
  rootDir: string,
  useHMR = false
): Record<string, string> {
  return Object.keys(languages).reduce((resultEntries, locale) => {
    const entryPath = getLanguageEntryPath(locale, rootDir);
    const modulePath = getLanguageModulePath(locale, rootDir);

    let content = `
      import message from './${path.basename(modulePath)}';

      (function () {var $IMA = {}; if ((typeof window !== "undefined") && (window !== null)) { window.$IMA = window.$IMA || {}; $IMA = window.$IMA; }
        $IMA.i18n = message;
      })();

      export default message;
    `;

    if (useHMR) {
      content += `
      if (module.hot) {
        module.hot.accept('./${path.basename(modulePath)}', () => {
          $IMA.i18n = message;

          window.__IMA_HMR.emitter.emit('update', { type: 'languages' })
        });
      }
      `;
    }

    if (!fs.existsSync(entryPath)) {
      fs.mkdirSync(path.dirname(entryPath), { recursive: true });
    }

    fs.writeFileSync(entryPath, content);

    return Object.assign(resultEntries, {
      [`locale/${locale}`]: entryPath,
    });
  }, {});
}

export async function generateTypeDeclarations(
  rootDir: string,
  messages: StringStructure
) {
  const dictionaryMap = new Map<string, string>();
  const dictionaryTypesPath = path.join(
    rootDir,
    TMP_BASEPATH,
    '/types/dictionary.ts'
  );

  (function recurseMessages(messages: StringStructure | string, path = '') {
    if (typeof messages === 'object') {
      Object.keys(messages).forEach(key => {
        recurseMessages(messages[key], `${path ? path + '.' : path}${key}`);
      });
    } else {
      dictionaryMap.set(path, messages);
    }
  })(messages);

  const content = `declare module '@ima/core' {
  interface DictionaryMap {
    ${Array.from(dictionaryMap.keys())
      .map(key => `'${key}': string;`)
      .join('\n\t\t')}
  }
}

export { };
`;

  if (!fs.existsSync(path.dirname(dictionaryTypesPath))) {
    await fs.promises.mkdir(path.dirname(dictionaryTypesPath));
  }

  await fs.promises.writeFile(
    path.join(rootDir, TMP_BASEPATH, '/types/dictionary.ts'),
    content
  );
}

/**
 * Parses language JSON files at languagePaths into messages dictionary object,
 * compiles the final messages object into messageformat JS module and outputs
 * it to filesystem at outputPath.
 *
 * @param messages Object which contains dictionary of parsed languages.
 * @param locale Currently processed locale identifier.
 * @param languagePaths Paths to JSON language files which should be processed.
 * @param outputPath Output path for the messageformat JS module.
 */
export async function parseLanguageFiles(
  messages: Record<string, any>,
  locale: string,
  languagePaths: string | string[],
  outputPath: string
): Promise<void | never> {
  // Load language JSON files and parse them into messages dictionary
  await Promise.all(
    (Array.isArray(languagePaths) ? languagePaths : [languagePaths]).map(
      async languagePath => {
        try {
          const dictionaryKey = getDictionaryKeyFromFileName(
            locale,
            languagePath
          );

          messages[dictionaryKey] = assignRecursively(
            messages[dictionaryKey] ?? {},
            JSON.parse((await fs.promises.readFile(languagePath)).toString())
          );
        } catch (error) {
          throw new Error(
            `Unable to parse language file at location: ${chalk.magenta(
              languagePath
            )}\n\n${(error as Error)?.message}`
          );
        }
      }
    )
  );

  // Write changes to language JS module
  const compiledModule = compileModule(new MessageFormat(locale), messages);
  await fs.promises.writeFile(outputPath, compiledModule);
}

/**
 * Compile language files defined in imaConfig.
 *
 * @param imaConfig ima.config.js file contents.
 * @param rootDir Current compilation root directory.
 * @param watch When set to true, it creates chokidar instances
 *  which watch language files for changes and trigger recompilation.
 */
export async function compileLanguages(
  imaConfig: ImaConfig,
  rootDir: string,
  watch = false
): Promise<void> {
  const locales = Object.keys(imaConfig.languages);
  const modulesBaseDir = path.dirname(getLanguageModulePath('en', rootDir));

  if (!fs.existsSync(modulesBaseDir)) {
    await fs.promises.mkdir(modulesBaseDir, { recursive: true });
  }

  await Promise.all(
    locales.map(async (locale, index) => {
      const messages: StringStructure = {};
      const outputPath = getLanguageModulePath(locale, rootDir);

      for (const glob of imaConfig.languages[locale]) {
        const languagePaths = await globby(glob, {
          cwd: rootDir,
          absolute: true,
        });

        // Parse the language files
        await parseLanguageFiles(messages, locale, languagePaths, outputPath);
      }

      // Run only for first language file to avoid conflicts
      if (index === 0) {
        // Don't await since it can be compiled lazily
        generateTypeDeclarations(rootDir, messages);
      }

      if (!watch) {
        return;
      }

      // Create chokidar instance for every language in watch mode
      chokidar
        .watch(imaConfig.languages[locale], {
          ignoreInitial: true,
          cwd: rootDir,
        })
        .on('all', async (eventName, changedRelativePath) => {
          if (!['unlink', 'add', 'change'].includes(eventName)) {
            return;
          }

          try {
            const changedLanguagePath = path.join(rootDir, changedRelativePath);

            /**
             * Remove deleted langauge file dictionary keys from messages.
             */
            if (eventName === 'unlink') {
              delete messages[
                getDictionaryKeyFromFileName(locale, changedLanguagePath)
              ];
            }

            // Don't reload any file when it is deleted
            await parseLanguageFiles(
              messages,
              locale,
              eventName === 'unlink' ? [] : [changedLanguagePath],
              outputPath
            );

            // Run only for first language file to avoid conflicts
            if (index === 0) {
              // Don't await since it can be compiled lazily
              generateTypeDeclarations(rootDir, messages);
            }
          } catch (error) {
            logger.error(error as Error);
          }
        })
        .on('error', error => {
          logger.error(
            new Error(
              `Unexpected error occurred while watching language files\n\n${(error as Error)?.message}`
            )
          );
        });
    })
  );
}
