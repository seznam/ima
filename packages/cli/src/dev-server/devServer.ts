import http from 'http';
import path from 'path';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from '@gatsbyjs/webpack-hot-middleware';
import { openEditorMiddleware } from './openEditorMiddleware';
import { evalSourceMapMiddleware } from './evalSourceMapMiddleware';
import { createWebpackConfig } from '../webpack/utils';
import { IMA_CLI_RUN_SERVER_MESSAGE } from '../lib/cli';
import logger from '../lib/logger';
import express, { Express } from 'express';
import pc from 'picocolors';
import prettyMs from 'pretty-ms';

async function createDevServer(app: Express) {
  const compiler = webpack(await createWebpackConfig(['client']));
  const isVerbose = process.argv.includes('--verbose');

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
  path.resolve(path.join(__dirname, '../../../../'));

  // Define dev middlewares
  app
    .use(
      devMiddleware(compiler, {
        index: false,
        publicPath: '/',
        ...(!isVerbose ? { stats: 'none' } : undefined),
        serverSideRender: true
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

                  logger.hmr(
                    `${pc.underline(bundle)} ${pc.gray(
                      hash
                    )} built in ${pc.green(prettyMs(parseInt(time, 10)))}`
                  );
                } else {
                  logger.hmr('Building...');
                }
              }
            }
          : undefined),
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
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
