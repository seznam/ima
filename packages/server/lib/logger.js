'use strict';

const { createLogger, format, transports } = require('winston');
const { printf, combine } = format;

function formatMetaSimple(meta) {
  let keys = Object.keys(meta).filter(
    key => ['level', 'timestamp', 'message'].indexOf(key) === -1
  );
  if (!meta || !keys.length) {
    return '';
  }

  let lines = keys.map(key => {
    let value = meta[key];
    if (value instanceof Error) {
      return key + ': ' + indentLines(value.stack, '   ', true);
    } else if (value instanceof Object) {
      return (
        key + ': ' + indentLines(JSON.stringify(value, null, 4), '   ', true)
      );
    } else {
      return key + ': ' + value;
    }
  });

  return '\n - ' + lines.join('\n - ');
}

function indentLines(string, spaces, skipFirstLine) {
  let lines = string.split('\n');

  let indentedLines = lines.map((line, index) => {
    if (!index && skipFirstLine) {
      return line;
    }

    return spaces + line;
  });

  return indentedLines.join('\n');
}

function formatMetaJSON(meta) {
  let keys = Object.keys(meta).filter(
    key => ['level', 'timestamp', 'message'].indexOf(key) === -1
  );
  if (!meta || !keys.length) {
    return '';
  }

  let clone = {};
  for (let key of keys) {
    if (meta[key] instanceof Error) {
      clone[key] = formatError(meta[key]);
    } else {
      clone[key] = meta[key];
    }
  }

  return JSON.stringify(clone, null, '\t');
}

function formatError(error) {
  let matcher = /^\s+at\s+([^(]+?)\s+[(](.+):(\d+):(\d+)[)]/;

  let stack = error.stack
    .split('\n')
    .slice(1)
    .map(line => {
      let parts = line.match(matcher);
      if (!parts) {
        return line;
      }

      return {
        function: parts[1],
        file: parts[2],
        row: parseInt(parts[3], 10) || parts[3],
        column: parseInt(parts[4], 10) || parts[4],
      };
    });

  let description = {
    type: error.name,
    message: error.message,
    stack,
  };

  if (error._params) {
    description.params = error._params;
  }

  return description;
}

module.exports = environment => {
  let FORMATTING = environment.$Server.logger.formatting;

  if (['simple', 'JSON'].indexOf(FORMATTING) === -1) {
    throw new Error(
      'Invalid logger configuration: the formatting has to be ' +
        `either "simple" or "JSON", ${FORMATTING} was provided`
    );
  }

  let logger = createLogger({
    format: combine(
      format(info => {
        let now = new Date();
        let date =
          now.getFullYear() +
          '-' +
          formatNumber(now.getMonth() + 1) +
          '-' +
          formatNumber(now.getDate());
        let time =
          formatNumber(now.getHours()) +
          ':' +
          formatNumber(now.getMinutes()) +
          ':' +
          formatNumber(now.getSeconds()) +
          '.' +
          now.getMilliseconds();

        info.timestamp = `${date} ${time}`;

        return info;

        function formatNumber(number) {
          let asString = '' + number;
          return asString.length > 1 ? asString : '0' + asString;
        }
      })(),
      printf(info => {
        return (
          info.timestamp +
          ' [' +
          info.level.toUpperCase() +
          '] ' +
          (info.message || '') +
          formatMeta(info)
        );
      })
    ),
    transports: [new transports.Console()],
  });

  function formatMeta(meta) {
    switch (FORMATTING) {
      case 'JSON':
        return formatMetaJSON(meta);
      case 'simple':
        return formatMetaSimple(meta);
      default:
        throw new Error(`Unrecognized log message formatting: ${FORMATTING}`);
    }
  }

  return logger;
};
