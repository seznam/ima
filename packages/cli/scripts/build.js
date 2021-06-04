const path = require('path');
const webpack = require('webpack');

async function build(args) {
  const compiler = webpack({
    mode: 'production',
    entry: path.resolve(args.cwd, 'test/index.js')
  });

  compiler.run((err, stats) => {
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

const buildCommand = {
  command: 'build',
  desc: 'Build an application for production',
  handler: async yargs => {
    await build({
      yargs: yargs,
      cwd: process.cwd()
    });
  }
};

module.exports = buildCommand;
