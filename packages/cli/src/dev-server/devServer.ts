import path from 'path';

import hotMiddleware from '@gatsbyjs/webpack-hot-middleware';
import express, { NextFunction, Request, Response } from 'express';
import expressStaticGzip from 'express-static-gzip';
import { Compiler } from 'webpack';
import devMiddleware from 'webpack-dev-middleware';

import { evalSourceMapMiddleware } from './evalSourceMapMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';

async function createDevServer(
  compiler: Compiler | undefined,
  hostname: string,
  port: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!compiler) {
      return reject();
    }

    const app = express();
    const isVerbose = process.argv.some(arg => arg.includes('--verbose=true'));
    const staticDir = path.dirname(require.resolve('@ima/error-overlay'));

    app
      .use((req, res, next) => {
        // Allow cors
        res.header('Access-Control-Allow-Origin', '*');

        next();
      })
      .use(
        '/__error-overlay-static',
        expressStaticGzip(path.dirname(require.resolve('@ima/error-overlay')), {
          enableBrotli: true,
          index: false,
          orderPreference: ['br'],
          serveStatic: {
            cacheControl: false,
            maxAge: '14d',
          },
        })
      )
      .use(
        '/__error-overlay-static',
        express.static(path.join(staticDir), { maxAge: '14d' })
      )
      .use(
        devMiddleware(compiler, {
          index: false,
          publicPath: '/',
          writeToDisk: true,
          ...(isVerbose ? undefined : { stats: 'none' }),
          serverSideRender: true,
        })
      )
      .use(
        hotMiddleware(compiler, {
          ...(isVerbose ? undefined : { quite: true, log: false }),
          path: '/__webpack_hmr',
          heartbeat: 5000,
        })
      )
      .use('/__get-internal-source', evalSourceMapMiddleware())
      .use('/__open-editor', openEditorMiddleware())
      .use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
          return next(err);
        }

        res.status(500).json({
          status: 'Something has happened with the @ima/cli/devServer 😢',
          error: err,
        });
      })
      .listen(port, hostname, () => {
        resolve();
      });
  });
}

export { createDevServer };
