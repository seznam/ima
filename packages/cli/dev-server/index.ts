import http from 'http';
import path from 'path';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import { evalSourceMapMiddleware } from './middleware/evalSourceMapMiddleware';
import { createWebpackConfig } from '../webpack/utils';
import { IMA_CLI_RUN_SERVER_MESSAGE, update } from '../lib/cli';
import express, { Express } from 'express';

async function createDevServer(app: Express) {
  const compiler = webpack(await createWebpackConfig(['client']));
  const isRawVerbose = process.argv.includes('--verbose=raw');

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
        ...(!isRawVerbose ? { stats: 'none' } : undefined),
        serverSideRender: true
      })
    )
    .use(
      hotMiddleware(compiler, {
        ...(!isRawVerbose
          ? {
              log: data => {
                // eslint-disable-next-line no-console
                update(`${data}`);
              }
            }
          : undefined),
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
      })
    )
    .use(evalSourceMapMiddleware())
    .use(
      '/__error-overlay-static',
      express.static(
        path.resolve(path.join(__dirname, '../../../error-overlay/dist/'))
      )
    );
}

export { createDevServer };
