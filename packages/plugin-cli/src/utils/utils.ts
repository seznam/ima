import fs from 'fs';
import path from 'path';

import chalk, { ChalkFunction } from 'chalk';
import prettyMs from 'pretty-ms';

function createPrintFn(prefix: string, chalkFn: ChalkFunction) {
  return (content: string) =>
    console.log(`${chalkFn(`${prefix}:`)} ${content}`);
}

export const info = createPrintFn('info', chalk.bold.cyan);
export const error = createPrintFn('error', chalk.bold.red);
export const warn = createPrintFn('warn', chalk.bold.yellow);
export const update = createPrintFn('update', chalk.bold.magenta);
export const success = createPrintFn('success', chalk.bold.green);

/**
 * Returns time utility function, which when called returns
 * formatted elapsed time from it's creation.
 *
 * @returns {() => string} Callback to return formatted elapsed time.
 */
export function trackTime(): () => string {
  const start = process.hrtime.bigint();

  return () =>
    prettyMs(Number((process.hrtime.bigint() - start) / BigInt(1e6)));
}

/**
 * Loads and parses package.json at given working directory.
 */
export async function parsePkgJSON(basePath: string): Promise<{
  name: string;
}> {
  return JSON.parse(
    await (
      await fs.promises.readFile(path.join(basePath, 'package.json'))
    ).toString()
  );
}
