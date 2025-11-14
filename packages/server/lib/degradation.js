/**
 * Degradation Helpers
 *
 * Pre-configured degradation functions that can be used across codebases
 * to control server rendering behavior based on various conditions.
 */

/**
 * Creates a degradation function that checks the user agent string against a pattern.
 *
 * @param {RegExp|((userAgent: string) => boolean)} pattern - Either a RegExp to test against
 *        or a function that receives the user agent string and returns a boolean
 * @returns {(event: any) => boolean} Degradation function
 *
 * @example
 * // Using RegExp
 * const botDegradation = createUserAgentDegradation(/Googlebot|Bingbot|SeznamBot/i);
 *
 * @example
 * // Using function
 * const customDegradation = createUserAgentDegradation((userAgent) => {
 *   return userAgent.includes('Bot') || userAgent.includes('Spider');
 * });
 */
function createUserAgentDegradation(pattern) {
  return event => {
    const userAgent = event.req?.get?.('user-agent') || '';

    if (pattern instanceof RegExp) {
      return pattern.test(userAgent);
    }

    if (typeof pattern === 'function') {
      return pattern(userAgent);
    }

    return false;
  };
}

/**
 * Creates a degradation function based on request path matching.
 *
 * @param {RegExp|string|string[]|((path: string) => boolean)} pattern - Pattern to match against request path
 * @returns {(event: any) => boolean} Degradation function
 *
 * @example
 * // Using RegExp
 * const apiDegradation = createPathDegradation(/^\/api\//);
 *
 * @example
 * // Using string prefix
 * const adminDegradation = createPathDegradation('/admin');
 *
 * @example
 * // Using array of paths
 * const staticDegradation = createPathDegradation(['/static', '/assets']);
 *
 * @example
 * // Using function
 * const complexDegradation = createPathDegradation((path) => {
 *   return path.startsWith('/api/') && path.includes('/heavy-operation');
 * });
 */
function createPathDegradation(pattern) {
  return event => {
    const path = event.req?.originalUrl || '';

    if (pattern instanceof RegExp) {
      return pattern.test(path);
    }

    if (typeof pattern === 'string') {
      return path.startsWith(pattern);
    }

    if (Array.isArray(pattern)) {
      return pattern.some(prefix => path.startsWith(prefix));
    }

    if (typeof pattern === 'function') {
      return pattern(path);
    }

    return false;
  };
}

/**
 * Creates a degradation function based on custom request headers.
 *
 * @param {string} headerName - Name of the header to check
 * @param {string|RegExp|((value: string) => boolean)} [matcher] - Optional matcher for header value
 * @returns {(event: any) => boolean} Degradation function
 *
 * @example
 * // Check if header exists
 * const hasAuthDegradation = createHeaderDegradation('authorization');
 *
 * @example
 * // Check header value with string
 * const jsonDegradation = createHeaderDegradation('content-type', 'application/json');
 *
 * @example
 * // Check header value with RegExp
 * const mobileDegradation = createHeaderDegradation('user-agent', /Mobile|Android|iPhone/i);
 *
 * @example
 * // Check header value with function
 * const customHeaderDegradation = createHeaderDegradation('x-custom', (value) => {
 *   return value.length > 100;
 * });
 */
function createHeaderDegradation(headerName, matcher) {
  return event => {
    const headerValue = event.req?.get?.(headerName) || '';

    if (!matcher) {
      return !!headerValue;
    }

    if (typeof matcher === 'string') {
      return headerValue === matcher;
    }

    if (matcher instanceof RegExp) {
      return matcher.test(headerValue);
    }

    if (typeof matcher === 'function') {
      return matcher(headerValue);
    }

    return false;
  };
}

/**
 * Combines multiple degradation functions with AND logic.
 *
 * @param {...Function} degradationFns - Degradation functions to combine
 * @returns {(event: any) => boolean} Degradation function
 *
 * @example
 * const combinedDegradation = combineAnd(
 *   createUserAgentDegradation(/Googlebot/i),
 *   createPathDegradation('/products')
 * );
 */
function combineAnd(...degradationFns) {
  return event => {
    return degradationFns.every(fn => fn(event));
  };
}

/**
 * Combines multiple degradation functions with OR logic.
 *
 * @param {...Function} degradationFns - Degradation functions to combine
 * @returns {(event: any) => boolean} Degradation function
 *
 * @example
 * const combinedDegradation = combineOr(
 *   createUserAgentDegradation(/Bot/i),
 *   createPathDegradation('/static')
 * );
 */
function combineOr(...degradationFns) {
  return event => {
    return degradationFns.some(fn => fn(event));
  };
}

/**
 * Inverts a degradation function.
 *
 * @param {Function} degradationFn - Degradation function to invert
 * @returns {(event: any) => boolean} Degradation function
 *
 * @example
 * const notBot = invert(
 *   createUserAgentDegradation(/Bot/i)
 * );
 */
function invert(degradationFn) {
  return event => {
    return !degradationFn(event);
  };
}

module.exports = {
  createUserAgentDegradation,
  createPathDegradation,
  createHeaderDegradation,
  combineAnd,
  combineOr,
  invert,
};
