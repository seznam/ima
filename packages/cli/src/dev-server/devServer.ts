import path from 'path';

import hotMiddleware from '@gatsbyjs/webpack-hot-middleware';
import express, { NextFunction, Request, Response } from 'express';
import expressStaticGzip from 'express-static-gzip';
import { Compiler } from 'webpack';
import devMiddleware from 'webpack-dev-middleware';

import { internalSourceMiddleware } from './internalSourceMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';

async function createDevServer({
  compiler,
  hostname,
  port,
  rootDir,
}: {
  compiler: Compiler | undefined;
  hostname: string;
  port: number;
  rootDir: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!compiler) {
      return reject();
    }

    const app = express();
    const isVerbose = process.argv.some(arg => arg.includes('--verbose'));
    const staticDir = path.dirname(require.resolve('@ima/error-overlay'));

    app
      .use((req, res, next) => {
        // Allow cors
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');

        next();
      })
      .use(
        '/__error-overlay-static',
        expressStaticGzip(path.dirname(require.resolve('@ima/error-overlay')), {
          enableBrotli: true,
          index: false,
          orderPreference: ['br'],
          serveStatic: {
            maxAge: '14d',
          },
        })
      )
      .use(
        '/__error-overlay-static',
        express.static(path.join(staticDir), { maxAge: '14d' })
      )
      .use(
        // @ts-expect-error Broken typ in devMiddleware package
        devMiddleware(compiler, {
          index: false,
          publicPath: '/',
          writeToDisk: true,
          ...(isVerbose ? undefined : { stats: 'none' }),
          serverSideRender: false,
        })
      )
      .use(
        // @ts-expect-error Broken typ in hotMiddleware package
        hotMiddleware(compiler, {
          ...(isVerbose ? undefined : { quite: true, log: false }),
          path: '/__webpack_hmr',
          heartbeat: 1500,
        })
      )
      .use('/__get-internal-source', internalSourceMiddleware(rootDir))
      .use('/__open-editor', openEditorMiddleware())
      .use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
          return next(err);
        }

        res.status(500).json({
          status: 'Something happened with the @ima/cli/devServer 😢',
          error: err,
        });
      })
      .listen(port, hostname, () => {
        resolve();
      })
      .on('error', error => {
        reject(error);
      });
  });
}

export { createDevServer };
