import http from 'http';
import path from 'path';

import hotMiddleware from '@gatsbyjs/webpack-hot-middleware';
import chalk from 'chalk';
import express, { Express } from 'express';
import prettyMs from 'pretty-ms';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';

import { IMA_CLI_RUN_SERVER_MESSAGE } from '../lib/cli';
import logger from '../lib/logger';
import { createWebpackConfig } from '../webpack/utils';
import { evalSourceMapMiddleware } from './evalSourceMapMiddleware';
import { openEditorMiddleware } from './openEditorMiddleware';

async function createDevServer(app: Express) {
  const { config } = await createWebpackConfig(['client']);
  const compiler = webpack(config);

  // Override listen so we can react when server is ready
  app.listen = function () {
    const server = http.createServer(this);

    // Inform cli that web server has started
    /* eslint-disable */
    // @ts-expect-error
    return server.listen.apply(server, arguments).on('listening', () => {
      /* eslint-enable */
      process.send?.(IMA_CLI_RUN_SERVER_MESSAGE);
    });
  };

  let isBuilding = false;
  const isVerbose = process.argv.some(arg => arg.includes('--verbose=true'));

  // Define dev middlewares
  app
    .use(
      devMiddleware(compiler, {
        index: false,
        publicPath: '/',
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
        heartbeat: 10 * 1000,
      })
    )
    .use('/__get-internal-source', evalSourceMapMiddleware())
    .use('/__open-editor', openEditorMiddleware())
    .use(
      '/__error-overlay-static',
      express.static(
        path.resolve(path.join(__dirname, '../../../error-overlay/dist/'))
      )
    );
}

export { createDevServer };
