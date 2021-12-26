import prettyMs from 'pretty-ms';

/**
 * Returns current time using process.hrtime. If argument is provided
 * it will return diff in ms.
 *
 *
 * @returns {BigInt} current time.
 */
function time(): () => string {
  const start = process.hrtime.bigint();

  return () =>
    prettyMs(Number((process.hrtime.bigint() - start) / BigInt(1e6)));
}

export { time };
