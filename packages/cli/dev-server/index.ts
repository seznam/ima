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
    // eslint-disable-next-line prefer-spread
    return server.listen.apply(server, arguments).on('listening', () => {
      process.send?.(IMA_CLI_RUN_SERVER_MESSAGE);
    });
  };

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
      '/__dev-static',
      express.static(
        path.resolve(path.join(__dirname, '../../error-overlay/build/'))
      )
    );
  // .use(async (req, res, next) => {
  //   const fileName = '/Users/jsimck/Desktop/wima/build/server/app.server.js';
  //   // const fileName = 'webpack-internal:///./app/page/home/HomeController.js';
  //   const fetchUrl = `http://localhost:3001/__get-internal-source?fileName=${encodeURIComponent(
  //     fileName
  //   )}`;

  //   try {
  //     const fileSource = await fetch(fetchUrl).then(r => r.text());
  //     const map = await getSourceMap(fileName, fileSource);
  //     console.log(map);
  //     const test = map.getOriginalPosition(20, 5);
  //     console.log(test);
  //     res.json({
  //       original: map.getOriginalPosition(20, 5),
  //       map: map
  //     });
  //     res.end();
  //   } catch (e) {
  //     console.log(e);
  //     res.end();
  //   }
  // });
}

export { createDevServer };
