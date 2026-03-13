import fs from 'fs';
import path from 'path';

import { assignRecursively } from '@ima/helpers';
import MessageFormat from '@messageformat/core';
import compileModule, {
  StringStructure,
} from '@messageformat/core/lib/compile-module';
import globby from 'globby';
import { Plugin } from 'vite';

import { ImaConfig } from '../../types';
import {
  generateTypeDeclarations,
  getDictionaryKeyFromFileName,
} from '../languages';

export const VIRTUAL_LOCALE_PREFIX = 'virtual:ima-locale/';
const RESOLVED_LOCALE_PREFIX = '\0' + VIRTUAL_LOCALE_PREFIX;

/**
 * Returns virtual module entry points for the Vite input config,
 * replacing the old disk-based entry point generation.
 */
export function getVirtualLanguageEntryPoints(
  languages: ImaConfig['languages']
): Record<string, string> {
  return Object.keys(languages).reduce(
    (acc, locale) => {
      acc[`locale/${locale}`] = `${VIRTUAL_LOCALE_PREFIX}${locale}`;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Vite plugin that serves compiled messageformat language modules as virtual
 * modules. Each locale maps to `virtual:ima-locale/{locale}`.
 *
 * In dev mode the plugin watches JSON source files and triggers HMR whenever
 * one of them changes, so the browser re-receives the updated translations
 * without a full page reload.
 */
export function imaLanguagesPlugin(
  imaConfig: ImaConfig,
  rootDir: string
): Plugin {
  // locale → resolved file paths discovered during the last load
  const localeFilesMap = new Map<string, Set<string>>();
  // locale → cached compiled module code; invalidated by handleHotUpdate
  const moduleCache = new Map<string, string>();
  // guard so buildStart only runs once across concurrent build passes
  let initialized = false;

  /**
   * Helper to get absolute file paths for a given glob pattern
   */
  async function getLanguagePaths(glob: string): Promise<string[]> {
    return await globby(glob, {
      cwd: rootDir,
      absolute: true,
    });
  }

  /**
   * Compile all JSON files for a given locale and return the JS module
   * source together with the runtime `$IMA.i18n` assignment.
   */
  async function buildLocaleModule(
    locale: string,
    addWatchFile?: (id: string) => void
  ): Promise<{ code: string; messages: StringStructure }> {
    const cached = moduleCache.get(locale);
    if (cached) {
      return { code: cached, messages: {} };
    }

    const messages: StringStructure = {};
    const files = new Set<string>();

    for (const glob of imaConfig.languages[locale]) {
      const languagePaths = await getLanguagePaths(glob);

      const entries = await Promise.all(
        languagePaths.map(async (languagePath) => {
          files.add(languagePath);
          addWatchFile?.(languagePath);

          const dictionaryKey = getDictionaryKeyFromFileName(
            locale,
            languagePath
          );

          try {
            const content = JSON.parse(
              (await fs.promises.readFile(languagePath)).toString()
            );
            return { dictionaryKey, content };
          } catch (error) {
            throw new Error(
              `Unable to parse language file at location: ${languagePath}\n\n${
                (error as Error)?.message
              }`
            );
          }
        })
      );

      for (const { dictionaryKey, content } of entries) {
        messages[dictionaryKey] = assignRecursively(
          (messages[dictionaryKey] as Record<string, unknown>) ?? {},
          content
        );
      }
    }

    localeFilesMap.set(locale, files);

    // compileModule emits `export default { ... }` as its last statement.
    // Rewrite that to a named const so we can reference it below without a
    // duplicate default export.
    const compiledModule = compileModule(
      new MessageFormat(locale),
      messages
    ).replace(/^export default /m, 'const message = ');

    const code = `
${compiledModule};

(function () {var $IMA = {}; if ((typeof window !== "undefined") && (window !== null)) { window.$IMA = window.$IMA || {}; $IMA = window.$IMA; }
  $IMA.i18n = message;
})();

export default message;

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      $IMA.i18n = newModule.default;
    }
  });
}
`.trim();

    moduleCache.set(locale, code);
    return { code, messages };
  }

  return {
    name: 'ima:languages',

    /**
     * On build start, compile all language modules and generate type declarations,
     * but only for the first built environment to avoid redundant work during build time.
     */
    async buildStart() {
      if (initialized) {
        return;
      }
      initialized = true;

      const locales = Object.keys(imaConfig.languages);
      const addWatchFile = this.addWatchFile.bind(this);

      await Promise.all(
        locales.map(async (locale, index) => {
          const { messages } = await buildLocaleModule(locale, addWatchFile);
          if (index === 0) {
            generateTypeDeclarations(rootDir, messages).catch(console.error);
          }
        })
      );
    },

    resolveId(id) {
      if (id.startsWith(VIRTUAL_LOCALE_PREFIX)) {
        return RESOLVED_LOCALE_PREFIX + id.slice(VIRTUAL_LOCALE_PREFIX.length);
      }
    },

    /**
     * Get the compiled module code for the requested locale.
     */
    async load(id) {
      if (!id.startsWith(RESOLVED_LOCALE_PREFIX)) {
        return;
      }

      const locale = id.slice(RESOLVED_LOCALE_PREFIX.length);
      const { code } = await buildLocaleModule(locale, this.addWatchFile.bind(this));

      return { code, moduleSideEffects: true };
    },

    /**
     * Handle HMR in the Vite dev server.
     * When a language JSON file changes, invalidate the corresponding virtual
     * module so Vite re-loads it and sends a hot update to the client.
     */
    async handleHotUpdate({ file, server }) {
      const affectedModules = [];

      for (const [locale, files] of localeFilesMap) {
        if (files.has(file)) {
          moduleCache.delete(locale);
          const moduleId = RESOLVED_LOCALE_PREFIX + locale;
          const mod = server.moduleGraph.getModuleById(moduleId);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            affectedModules.push(mod);
          }
        }
      }

      if (affectedModules.length > 0) {
        return affectedModules;
      }

      // Also handle newly added files that match a locale glob
      for (const locale of Object.keys(imaConfig.languages)) {
        for (const glob of imaConfig.languages[locale]) {
          const paths = await getLanguagePaths(glob);
          if (paths.includes(file)) {
            moduleCache.delete(locale);
            const moduleId = RESOLVED_LOCALE_PREFIX + locale;
            const mod = server.moduleGraph.getModuleById(moduleId);
            if (mod) {
              server.moduleGraph.invalidateModule(mod);
              affectedModules.push(mod);
            }
          }
        }
      }

      return affectedModules.length > 0 ? affectedModules : undefined;
    },

    /**
     * In watch / build mode, also tell Vite's file watcher about glob
     * patterns so new files matching those globs trigger a rebuild.
     */
    configureServer(server) {
      for (const locale of Object.keys(imaConfig.languages)) {
        for (const glob of imaConfig.languages[locale]) {
          // Resolve relative globs to absolute so chokidar can watch them
          const absGlob = path.isAbsolute(glob)
            ? glob
            : path.join(rootDir, glob);
          server.watcher.add(absGlob);
        }
      }
    },
  };
}
