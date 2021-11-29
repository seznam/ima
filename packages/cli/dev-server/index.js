import pc from 'picocolors';
import http from 'http';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import { createWebpackConfig } from '../webpack/utils';
import { IMA_CLI_RUN_SERVER_MESSAGE } from '../lib/cli';

async function createDevServer(app) {
  const compiler = webpack(await createWebpackConfig(['client']));
  const isRawVerbose = process.argv.includes('--verbose=raw');

  // Override listen so we can react when server is ready
  app.listen = function () {
    const server = http.createServer(this);

    // Inform cli that web server has started
    return server.listen.apply(server, arguments).on('listening', () => {
      process.send(IMA_CLI_RUN_SERVER_MESSAGE);
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
                console.log(`${pc.magenta('hmr:')} ${data}`);
              }
            }
          : undefined),
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
      })
    );
  // .use((req, res, next) => {
  //   if (req.url.startsWith('/__get-internal-source')) {
  //     const fileName = req.query.fileName;
  //     const id = fileName.match(/webpack-internal:\/\/\/(.+)/)[1];
  //     const compilation =
  //       res?.locals?.webpack?.devMiddleware?.stats?.stats[0]?.compilation;

  //     if (!id || !compilation) {
  //       next();
  //     }

  //     const source = getSourceById(compilation, id);
  //     const sourceMapURL = `//# sourceMappingURL=${base64SourceMap(source)}`;
  //     const sourceURL = `//# sourceURL=webpack-internal:///${module.id}`;
  //     res.end(`${source.source()}\n${sourceMapURL}\n${sourceURL}`);
  //   } else {
  //     next();
  //   }
  // })
  // .use(async (req, res, next) => {
  //   const fileName = 'webpack-internal:///./app/page/home/HomeView.jsx';
  //   const fetchUrl = `http://localhost:3001/__get-internal-source?fileName=${encodeURIComponent(
  //     fileName
  //   )}`;

  //   try {
  //     const fileSource = await fetch(fetchUrl).then(r => r.text());
  //     const map = await getSourceMap(fileName, fileSource);

  //     console.log(map);
  //     res.json(map);
  //     res.end();
  //   } catch (e) {
  //     console.log(e);
  //     res.end();
  //   }
  // });
}

export { createDevServer };
