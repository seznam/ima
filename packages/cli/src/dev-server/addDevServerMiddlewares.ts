import path from 'path';

import { ParsedEnvironment } from '@ima/core';
import { urlParserFactory } from '@ima/server';
import express, { NextFunction, Request, Response } from 'express';
import expressStaticGzip from 'express-static-gzip';

import { internalSourceMiddleware } from './internalSourceMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';
import { ImaCliArgs, ImaConfig } from '../types';
import { ViteDevServer } from 'vite';

export function addDevServerMiddlewaresFactory({
  args,
  config,
  environment,
  vite,
}: {
  args: ImaCliArgs;
  config: ImaConfig;
  environment: ParsedEnvironment;
  vite: ViteDevServer;
}) {
  return function addDevServerMiddlewares(app: express.Express) {
    const staticDir = path.join(
      path.dirname(require.resolve('@ima/error-overlay')),
      '..'
    );

    const { getProtocol } = urlParserFactory({
      environment,
      applicationFolder: args.rootDir,
    });

    /**
     * Helper to retrieve server origin used for CORS definition.
     */
    function getOrigin(req: Request) {
      if (config.devServer?.origin) {
        return config.devServer.origin;
      }

      return `${getProtocol(req as any)}//localhost:${environment.$Server.port}`;
    }

    app
      // CORS
      .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', getOrigin(req));
        res.header('Access-Control-Allow-Headers', 'OPTIONS, GET');

        next();
      })
      .use(vite.middlewares)
      // Serve brotli version primary
      .use(
        '/__error-overlay-static',
        expressStaticGzip(staticDir, {
          enableBrotli: true,
          index: false,
          orderPreference: ['br'],
          serveStatic: {
            maxAge: '14d',
          },
        })
      )
      // Non-zipped compressed version fallback
      .use(
        '/__error-overlay-static',
        express.static(path.join(staticDir), { maxAge: '14d' })
      )
      .use('/__get-internal-source', internalSourceMiddleware(args.rootDir))
      .use('/__open-editor', openEditorMiddleware())
      .use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
          return next(err);
        }

        res.status(500).json({
          status: 'Something is wrong with the @ima/cli/devServer',
          error: err,
        });
      });
  };
}
