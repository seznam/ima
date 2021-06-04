const path = require('path');
const webpack = require('webpack');

async function dev(args) {
  const compiler = webpack({
    mode: 'production',
    entry: path.resolve(args.cwd, 'test/index.js')
  });

  compiler.watch({}, (err, stats) => {
    if (!err) {
      const out = stats.toString({
        assets: true,
        cached: false,
        children: false,
        chunks: false,
        chunkModules: false,
        colors: true,
        hash: true,
        modules: false,
        reasons: false,
        source: false,
        timings: true,
        version: true
      });

      console.log(out);
    } else {
      console.error(err);
    }
  });
}

const devCommand = {
  command: 'dev',
  desc: 'Run application in development mode',
  builder: {
    'legacy-compat-mode': {
      desc: 'Runs application in ES5 compatible format'
    }
  },
  handler: async yargs => {
    await dev({
      yargs: yargs,
      cwd: process.cwd()
    });
  }
};

module.exports = devCommand;
