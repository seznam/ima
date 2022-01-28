import path from 'path';

import fg from 'fast-glob';
import { LoaderDefinitionFunction } from 'webpack';

export interface ExtendLessLoaderOptions {
  globalsPath?: string;
}

const importRE = /^@import\s['"](.*)['"];$/gm;

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
      const result = fg.sync(normalizedImportPath, { cwd, absolute: true });

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

    return `@import "${globalsPath}";\n\n${source.replace(
      importRE,
      expandGlobs
    )}`;
  };

export default ExtendLessLoader;
