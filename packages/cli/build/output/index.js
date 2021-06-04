function statsFormattedOutput(err, stats) {
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
}

module.exports = {
  statsFormattedOutput
};
