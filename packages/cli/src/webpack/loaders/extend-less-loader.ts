import fs from 'fs';
import path from 'path';

import globby from 'globby';
import { LoaderDefinitionFunction } from 'webpack';

export interface ExtendLessLoaderOptions {
  globalsPath?: string;
}

const importRE = /^@import\s['"](.*)['"];$/gm;

/**
 * Normalizes glob paths by preppending app and node_module
 * expressions with their path prefix. Other paths are left intact.
 *
 * @param {string} globPath
 * @param {string} cwd Current working directory related to globPath.
 * @returns {string}
 */
function normalizeGlobPath(globPath: string, cwd: string) {
  if (globPath.startsWith('.')) {
    return globPath;
  }

  // Leave absolute imports intact
  if (globPath.startsWith('/')) {
    return globPath;
  }

  // Join absolute paths with prefixes to app or node_modules and full path
  return globPath.startsWith('app')
    ? path.join(cwd, globPath)
    : path.join(cwd, 'node_modules', globPath);
}

/**
 * This loader extends less functionality in ima.js applications by enabling
 * glob imports in the @import ""; less expression and preppending import
 * to global.less file if it exist into every process less file (so globals
 * are available without additional imports).
 *
 * @param {string} source Module source.
 * @returns {string}
 */
const ExtendLessLoader: LoaderDefinitionFunction<ExtendLessLoaderOptions> =
  function (source) {
    this.cacheable(true);

    const { globalsPath } = this.getOptions();
    const expandGlobs = (match: string, importPath: string): string => {
      if (!(importPath && importPath.trim())) {
        return importPath;
      }

      /**
       * Relative imports are resolved relative to the current context (module path).
       * Non-relative (module root) imports are resolved to the root
       * of the application (app/ or node_modules).
       */
      const cwd = importPath.startsWith('.') ? this.context : this.rootContext;
      const normalizedImportPath = normalizeGlobPath(importPath, cwd);
      const result = globby.sync(normalizedImportPath, { cwd, absolute: true });

      if (result.length === 1 && result[0] === importPath) {
        return match;
      }

      return result
        .map(expandedImportPath => {
          // Add files to dependencies
          this.dependency(expandedImportPath);

          return `@import "${expandedImportPath}";`;
        })
        .join('\n');
    };

    let newSource = source.replace(importRE, expandGlobs);

    // Preppend globals import
    if (globalsPath && fs.existsSync(globalsPath)) {
      newSource = `@import "${globalsPath}";\n\n${newSource}`;
    }

    return newSource;
  };

export default ExtendLessLoader;
