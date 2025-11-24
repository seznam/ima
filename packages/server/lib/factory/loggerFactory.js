/**
 * Logger factory for IMA.js server
 * Provides JSON-based logging for production environments
 */

/**
 * Private method to write log messages with JSON formatting
 * @param {string} channel - Log channel (process.stdout, process.stderr, etc.)
 * @param {string} level - Log level (log, info, warn, error)
 * @param {any[]} data - data to log
 */
function _writeLog(channel, level, data) {
  const logData = JSON.stringify({
    level,
    data: typeof data === 'string' ? { message: data } : data,
  });

  channel.write(logData); // use direct write to avoid extra formatting (e.g., from console.error)
}

/**
 * Create production logger with JSON output
 * @returns {import('@ima/server').Logger}
 */
function createJSONLogger() {
  return {
    log: (...args) => _writeLog(process.stdout, 'log', args),
    info: (...args) => _writeLog(process.stdout, 'info', args),
    warn: (...args) => _writeLog(process.stdout, 'warn', args),
    error: (...args) => _writeLog(process.stderr, 'error', args),
    trace: (...args) => _writeLog(process.stderr, 'trace', args),
    debug: (...args) => _writeLog(process.stdout, 'debug', args),
  };
}

module.exports = createJSONLogger;
