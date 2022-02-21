import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';
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
  return async (req: Request, res: Response) => {
    let fileUri = req.query.fileName?.toString().replace('webpack://', '');

    /**
     * Parse webpack internal modules (HMR)
     */
    if (fileUri?.startsWith('webpack-internal:///')) {
      const compilation =
        res?.locals?.webpack?.devMiddleware?.stats?.compilation;

      if (!fileUri || !compilation) {
        return res.status(500).end();
      }

      const moduleId = fileUri
        .toString()
        .match(/webpack-internal:\/\/\/(.+)/)?.[1];

      if (!moduleId) {
        return res.status(500).end();
      }

      const source = getSourceByModuleId(compilation, moduleId);

      if (!source) {
        return res.status(500).end();
      }

      const sourceMapURL = `//# sourceMappingURL=${base64SourceMap(source)}`;
      const sourceURL = `//# sourceURL=webpack-internal:///${moduleId}`;
      return res.end(`${source.source()}\n${sourceMapURL}\n${sourceURL}`);
    } else {
      // Handle files with absolute/relative urls
      if (!fileUri) {
        return res.status(500).end();
      }

      fileUri = path.isAbsolute(fileUri) ? fileUri : path.resolve(fileUri);

      if (!fs.existsSync(fileUri)) {
        return res.status(500).end();
      }

      try {
        const fileSource = await fs.promises.readFile(fileUri, 'utf8');

        return res.end(fileSource);
      } catch (error) {
        return res.status(500).end();
      }
    }
  };
}

export { evalSourceMapMiddleware };
