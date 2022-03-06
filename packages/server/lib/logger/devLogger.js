const winston = require('winston');
const TransportStream = require('winston-transport');
const { formatError } = require('@ima/dev-utils/dist/cliUtils');

const { colorizeLevel } = require('./loggerUtils');

class ConsoleAsync extends TransportStream {
  constructor(options = {}) {
    super(options);

    this.name = options.name || 'console-async';
    this.rootDir = options.rootDir;
  }

  log(info, callback) {
    this._log(info, callback);
  }

  async _log(meta, callback) {
    // eslint-disable-next-line no-console
    (console[meta.level] ?? console.log)(
      `${colorizeLevel(meta.level)}${
        meta.error
          ? await formatError(meta.error, 'runtime', this.rootDir)
          : meta.message
      }`
    );

    callback();
  }
}

const logger = winston.createLogger({
  format: winston.format.json(),
  levels: winston.config.npm.levels,
  transports: [
    new ConsoleAsync({
      rootDir: process.cwd(),
    }),
  ],
});

module.exports = logger;
