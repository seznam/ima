import path from 'path';

import hotMiddleware from '@gatsbyjs/webpack-hot-middleware';
import chalk from 'chalk';
import express from 'express';
import prettyMs from 'pretty-ms';
import { Compiler, MultiCompiler } from 'webpack';
import devMiddleware from 'webpack-dev-middleware';

import logger from '../lib/logger';
import { evalSourceMapMiddleware } from './evalSourceMapMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';

async function createDevServer(compiler: MultiCompiler) {
  const app = express();

  let isBuilding = false;
  const isVerbose = process.argv.some(arg => arg.includes('--verbose=true'));

  const dev = devMiddleware(compiler, {
    index: false,
    publicPath: '/',
    writeToDisk: true,
    ...(!isVerbose ? { stats: 'none' } : undefined),
    serverSideRender: true,
  });

  // TODO
  // dev.getFilenameFromUrl()

  const hot = hotMiddleware(compiler, {
    ...(!isVerbose
      ? {
          log: data => {
            const match = data.match(/^webpack built (.*) (.*) in (\d+)ms$/i);

            if (match) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const [message, bundle, hash, time] = match;

              // Used to prevent multiple building messages after each other
              isBuilding = false;

              logger.hmr(
                `Built ${chalk.bold(bundle)} ${chalk.gray(
                  '[' + prettyMs(parseInt(time, 10)) + ']'
                )}`
              );
            } else if (!isBuilding) {
              logger.hmr('Building...');
              isBuilding = true;
            }
          },
        }
      : undefined),
    path: '/__webpack_hmr',
    heartbeat: 5000,
  });

  app
    .use(dev)
    .use(hot)
    .use('/__get-internal-source', evalSourceMapMiddleware())
    .use('/__open-editor', openEditorMiddleware())
    .use(
      '/__error-overlay-static',
      express.static(
        path.resolve(path.join(__dirname, '../../../error-overlay/dist/'))
      )
    )
    .listen(5001);
}

export { createDevServer };
