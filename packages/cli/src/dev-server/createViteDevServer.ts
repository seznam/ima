import path from 'path';

import { ParsedEnvironment } from '@ima/core';
import { logger } from '@ima/dev-utils/logger';
import { urlParserFactory } from '@ima/server';
import chalk from 'chalk';
import express, { NextFunction, Request, Response } from 'express';
import expressStaticGzip from 'express-static-gzip';
import { createServer, ViteDevServer } from 'vite';

import { createViteConfig } from '../vite/utils/utils';
import { createManifestFileForDev } from '../lib/manifest';
import { internalSourceMiddleware } from './internalSourceMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';
import { ImaCliArgs, ImaConfig, ViteConfigWithEnvironments } from '../types';

export async function createViteDevServer({
  args,
  config,
  hostname,
  port,
  rootDir,
  environment,
}: {
  args: ImaCliArgs;
  config: ImaConfig;
  hostname: string;
  port: number;
  rootDir: string;
  publicUrl: string;
  environment: ParsedEnvironment;
}): Promise<{ vite: ViteDevServer }> {
  return new Promise(async (resolve, reject) => {
    // Vite dev server requires us to use `client` and `ssr` environments
    const viteConfig = await createViteConfig(args, config);
    const viteConfigWithMappedEnvironments: ViteConfigWithEnvironments = {
      ...viteConfig,
      environments: {
        client: viteConfig.environments.modern,
        ssr: viteConfig.environments.server,
      },
    };

    // Dev manifest is referencing the input files instead of output,
    // so we can create it before the dev server starts
    await createManifestFileForDev(config, viteConfigWithMappedEnvironments);
    // Start the Vite dev server
    const vite = await createServer({
      ...viteConfigWithMappedEnvironments,
      appType: 'custom',
    });

    vite.watcher.on('add', (filePath) => {
      logger.info(`${filePath} ${chalk.green('(new file)')}`);
    });

    vite.watcher.on('change', (filePath) => {
      logger.info(`${filePath} ${chalk.yellow('(changed)')}`);
    });

    vite.watcher.on('unlink', (filePath) => {
      logger.info(`${filePath} ${chalk.red('(deleted)')}`);
    });

    const app = express();

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
      .use(vite.middlewares)
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
        resolve({ vite });
      })
      .on('error', error => {
        reject(error);
      });
  });
}
