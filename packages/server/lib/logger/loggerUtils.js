const chalk = require('chalk');

const RE_EXTRACT_LOCATIONS = /\(?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;

/**
 * Extract file uri, line and column number from
 * parsed token line.
 *
 * @param {string} token Parsed stack trace line.
 * @returns {object}
 */
function extractLocation(token) {
  const [fileUri, lineNumber, columnNumber] =
    RE_EXTRACT_LOCATIONS.exec(token)?.slice(1) || [];

  return {
    fileUri,
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber),
  };
}

/**
 * Parse error location from stack trace line
 * including function name.
 */
function parseLocation(traceLine) {
  if (traceLine.indexOf('(eval ') !== -1) {
    traceLine = traceLine.replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
  }

  if (traceLine.indexOf('(at ') !== -1) {
    traceLine = traceLine.replace(/\(at /, '(');
  }

  const data = traceLine.trim().split(/\s+/g).slice(1);
  const traceToken = data.pop();
  const { fileUri, lineNumber, columnNumber } =
    (traceToken && extractLocation(traceToken)) || {};

  return {
    functionName: data.join(' ') || 'anonymous',
    fileUri,
    lineNumber,
    columnNumber,
  };
}

function colorizeLevel(level) {
  switch (level) {
    case 'error':
      return chalk.bold.red(`${level}: `);
    case 'warn':
      return chalk.bold.yellow(`${level}: `);
    case 'info':
      return chalk.bold.cyan(`${level}: `);
    case 'http':
      return chalk.bold.magenta(`${level}: `);
    case 'verbose':
      return chalk.bold.underline.white(`${level}: `);
    case 'debug':
      return chalk.bold.green(`${level}: `);
    case 'silly':
    default:
      return chalk.bold.gray(`${level}: `);
  }
}

module.exports = { colorizeLevel, parseLocation };
