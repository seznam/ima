const SENTINEL_TO_WEB = 'ima:devtool:to:web';
const SENTINEL_TO_EXTENSION = 'ima:devtool:to:extension';

/**
 * Validates if input data are JSON serializable and creates message entry.
 *
 * @param {Object} data Data containing passed message with action, payload and sentinel properties.
 * @returns {Object} Error message object if data are not serializable, otherwise input data.
 */
function createEntry(data) {
  let message = null;

  try {
    message = JSON.parse(JSON.stringify(data));
  } catch (error) {
    message = {
      sentinel: data.sentinel,
      action: 'error',
      payload: {},
      error,
    };
  }

  return message;
}

export { SENTINEL_TO_WEB, SENTINEL_TO_EXTENSION, createEntry };
