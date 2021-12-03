import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { Compilation, sources } from 'webpack';

function base64SourceMap(source: sources.Source) {
  const base64 = Buffer.from(JSON.stringify(source.map()), 'utf8').toString(
    'base64'
  );

  return `data:application/json;charset=utf-8;base64,${base64}`;
}

function getSourceByModuleId(
  compilation: Compilation,
  moduleId: string | number
) {
  return Array.from(compilation?.modules)
    .find(
      module =>
        module && compilation?.chunkGraph?.getModuleId(module) == moduleId
    )
    ?.originalSource();
}

function evalSourceMapMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith('/__get-internal-source')) {
      let fileUri = req.query.fileName?.toString().replace('webpack://', '');

      /**
       * Parse webpack internal modules (HMR)
       */
      if (fileUri?.startsWith('webpack-internal:///')) {
        const compilation =
          res?.locals?.webpack?.devMiddleware?.stats?.stats[0]?.compilation;

        if (!fileUri || !compilation) {
          // TODO really next? what happens when file is invalid
          return next();
        }

        const moduleId = fileUri
          .toString()
          .match(/webpack-internal:\/\/\/(.+)/)?.[1];

        if (!moduleId) {
          return next();
        }

        const source = getSourceByModuleId(compilation, moduleId);

        if (!source) {
          return next();
        }

        const sourceMapURL = `//# sourceMappingURL=${base64SourceMap(source)}`;
        const sourceURL = `//# sourceURL=webpack-internal:///${moduleId}`;
        return res.end(`${source.source()}\n${sourceMapURL}\n${sourceURL}`);
      } else {
        // Handle files with absolute/relative urls
        if (!fileUri) {
          // TODO error?
          return next();
        }

        fileUri = path.isAbsolute(fileUri)
          ? fileUri
          : path.resolve('../', fileUri);

        if (!fs.existsSync(fileUri)) {
          return next();
        }

        // TODO async?
        const fileSource = fs.readFileSync(fileUri, 'utf-8');
        return res.end(fileSource);
      }
    }

    return next();
  };
}

export { evalSourceMapMiddleware };
