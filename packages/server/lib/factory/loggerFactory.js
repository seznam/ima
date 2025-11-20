/**
 * Logger factory for IMA.js server
 * Provides JSON-based logging for production environments
 */

/**
 * Private method to write log messages with JSON formatting
 * @param {string} level - Log level (log, info, warn, error)
 * @param {any[]} data - data to log
 */
function _writeLog(level, data) {
  const logData = JSON.stringify({
    level,
    data: typeof data === 'string' ? { message: data } : data,
  });

  if (level === 'error' || level === 'trace') {
    process.stderr.write(logData); // use direct write to avoid extra formatting (e.g., from console.error)
  } else {
    process.stdout.write(logData); // use direct write to avoid extra formatting (e.g., from console.log)
  }
}

/**
 * Create production logger with JSON output
 * @returns {import('@ima/server').Logger}
 */
function loggerFactory() {
  return {
    log: (...args) => _writeLog('log', args),
    info: (...args) => _writeLog('info', args),
    warn: (...args) => _writeLog('warn', args),
    error: (...args) => _writeLog('error', args),
    trace: (...args) => _writeLog('trace', args),
    debug: (...args) => _writeLog('debug', args),
  };
}

module.exports = loggerFactory;
