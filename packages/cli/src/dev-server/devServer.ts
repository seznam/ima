import path from 'path';

import { Environment } from '@ima/core';
import { urlParserFactory } from '@ima/server';
import express, { NextFunction, Request, Response } from 'express';
import expressStaticGzip from 'express-static-gzip';
import { Compiler } from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

import { internalSourceMiddleware } from './internalSourceMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';
import { ImaCliArgs, ImaConfig } from '../types';

const WRITE_TO_DISK_WHITELIST = /(runner\.js|manifest\.json|favicon\.ico)$/i;

export async function createDevServer({
  args,
  config,
  compiler,
  hostname,
  port,
  rootDir,
  environment,
}: {
  args: ImaCliArgs;
  config: ImaConfig;
  compiler: Compiler | undefined;
  hostname: string;
  port: number;
  rootDir: string;
  publicUrl: string;
  environment: Environment;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!compiler) {
      return reject();
    }

    const app = express();
    const isVerbose = process.argv.some(arg => arg.includes('--verbose'));
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

      return `${getProtocol(req)}//localhost:${environment.$Server.port}`;
    }

    app
      // CORS
      .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', getOrigin(req));
        res.header('Access-Control-Allow-Headers', 'OPTIONS, GET');

        next();
      })
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
      .use(
        devMiddleware(compiler, {
          index: false,
          publicPath: process.env.IMA_PUBLIC_PATH ?? config.publicPath,
          headers: (req, res) => {
            res.header('Access-Control-Allow-Origin', getOrigin(req));
            res.header('Access-Control-Allow-Headers', 'OPTIONS, GET');
          },
          writeToDisk: args.writeToDisk
            ? () => true
            : filePath =>
                (WRITE_TO_DISK_WHITELIST.test(filePath) ||
                  config.devServer?.writeToDiskFilter?.(filePath)) ??
                false,
          ...(isVerbose ? undefined : { stats: 'none' }),
          serverSideRender: false,
        })
      )
      .use(
        hotMiddleware(compiler, {
          ...(isVerbose ? undefined : { quiet: true, log: () => {} }),
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
          status: 'Something is wrong with the @ima/cli/devServer',
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
