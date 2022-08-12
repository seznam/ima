import prettyMs from 'pretty-ms';

/**
 * Returns time utility function, which when called returns
 * formatted elapsed time from it's creation.
 *
 * @returns {() => string} Callback to return formatted elapsed time.
 */
function time(): () => string {
  const start = process.hrtime.bigint();

  return () =>
    prettyMs(Number((process.hrtime.bigint() - start) / BigInt(1e6)));
}

export { time };
