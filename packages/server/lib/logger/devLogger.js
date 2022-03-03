const chalk = require('chalk');
const winston = require('winston');
const { colorizeLevel, parseLocation } = require('./loggerUtils');

function formatError(error, rootDir) {
  const output = [`${chalk.underline(`${error.name}:`)} ${error.message}\n`];

  if (error.stack) {
    // Skip first stack line since it contains error name and message
    // eslint-disable-next-line no-unused-vars
    const [_, ...stackLines] = error.stack.split('\n');
    output.push(chalk.gray(stackLines.join('\n')));

    try {
      // Try to parse error location
      const errorLoc = parseLocation(stackLines[0]);

      output.unshift(
        `${chalk.magenta(`${errorLoc.functionName}`)} at ${chalk.cyan(
          `${errorLoc.fileUri.replace(rootDir, '.')}:${errorLoc.lineNumber}:${
            errorLoc.columnNumber
          }`
        )}`
      );
    } catch {
      // Fail silently
    }
  }

  return output.join('\n') + '\n';
}

function customFormatter(rootDir) {
  return meta => {
    return `${colorizeLevel(meta.level)}${
      meta.error ? formatError(meta.error, rootDir) : meta.message
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
