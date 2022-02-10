import path from 'path';

import hotMiddleware from '@gatsbyjs/webpack-hot-middleware';
import chalk from 'chalk';
import express from 'express';
import prettyMs from 'pretty-ms';
import { MultiCompiler } from 'webpack';
import devMiddleware from 'webpack-dev-middleware';

import * as logger from '../lib/logger';
import { evalSourceMapMiddleware } from './evalSourceMapMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';

async function createDevServer(
  compiler: MultiCompiler,
  hostname: string,
  port: number
) {
  const app = express();

  let isBuilding = false;
  const isVerbose = process.argv.some(arg => arg.includes('--verbose=true'));

  app
    .use((req, res, next) => {
      // Allow cors
      res.header('Access-Control-Allow-Origin', '*');

      next();
    })
    .use(
      devMiddleware(compiler, {
        index: false,
        publicPath: '/',
        writeToDisk: true,
        ...(!isVerbose ? { stats: 'none' } : undefined),
        serverSideRender: true,
      })
    )
    .use(
      hotMiddleware(compiler, {
        ...(!isVerbose
          ? {
              log: data => {
                const match = data.match(
                  /^webpack built (.*) (.*) in (\d+)ms$/i
                );

                if (match) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const [message, bundle, hash, time] = match;

                  // Used to prevent multiple building messages after each other
                  isBuilding = false;

                  logger.update(
                    `Built ${chalk.bold(bundle)} ${chalk.gray(
                      `[${prettyMs(parseInt(time, 10))}]`
                    )}`
                  );
                } else if (!isBuilding) {
                  logger.update('Building...');
                  isBuilding = true;
                }
              },
            }
          : undefined),
        path: '/__webpack_hmr',
        heartbeat: 5000,
      })
    )
    .use('/__get-internal-source', evalSourceMapMiddleware())
    .use('/__open-editor', openEditorMiddleware())
    .use(
      '/__error-overlay-static',
      express.static(
        path.resolve(path.join(__dirname, '../../../error-overlay/dist/'))
      )
    )
    .listen(port, hostname);
}

export { createDevServer };
