const winston = require('winston');
const { highlightError } = require('@ima/dev-utils/dist/cliHighlight');

const { colorizeLevel } = require('./loggerUtils');

function customFormatter(rootDir) {
  return meta => {
    return `${colorizeLevel(meta.level)}${
      meta.error ? highlightError(meta.error, 'runtime', rootDir) : meta.message
    }`;
  };
}

const logger = winston.createLogger({
  format: winston.format.json(),
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(customFormatter(process.cwd()))
      ),
    }),
  ],
});

module.exports = logger;
