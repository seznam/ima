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
      const fileName = req.query.fileName;
      const compilation =
        res?.locals?.webpack?.devMiddleware?.stats?.stats[0]?.compilation;

      if (!fileName || !compilation) {
        // TODO really next? what happens when file is invalid
        return next();
      }

      const moduleId = fileName
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
      const sourceURL = `//# sourceURL=webpack-internal:///${module.id}`;
      res.end(`${source.source()}\n${sourceMapURL}\n${sourceURL}`);
    } else {
      return next();
    }
  };
}

export { evalSourceMapMiddleware };
