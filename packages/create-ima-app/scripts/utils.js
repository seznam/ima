import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import merge from 'deepmerge';

function createPrintFn(prefix, chalkFn) {
  return content => console.log(`${chalkFn(`${prefix}:`)} ${content}`);
}

export const info = createPrintFn('info', chalk.bold.cyan);
export const error = createPrintFn('error', chalk.bold.red);
export const warn = createPrintFn('warn', chalk.bold.yellow);
export const success = createPrintFn('success', chalk.bold.green);

export async function mergePkgJson(baseDir, srcDir, destDir) {
  if (!fs.existsSync(path.join(srcDir, 'package.json'))) {
    return;
  }

  const pkgJsonFiles = await Promise.all(
    [
      fs.promises.readFile(path.join(baseDir, 'package.json')),
      fs.promises.readFile(path.join(srcDir, 'package.json')),
    ].map(pkgJsonPromise => pkgJsonPromise.then(pkgJson => JSON.parse(pkgJson)))
  );

  return fs.promises.writeFile(
    path.join(destDir, 'package.json'),
    JSON.stringify(merge(...pkgJsonFiles), null, 2)
  );
}
