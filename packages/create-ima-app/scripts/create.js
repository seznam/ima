/* eslint-disable import/no-named-as-default-member */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import fsExtra from 'fs-extra/esm';

import { info, error, mergePkgJson } from './utils.js';

export async function create(projDir, useTS, usePNPM) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  info(
    `Creating new IMA.js application inside the ${chalk.magenta(
      projDir
    )} directory...`,
    true
  );

  const projName = projDir.split(path.sep).pop();
  const appRoot = path.resolve(projDir.toString());
  const tplRoot = path.join(__dirname, '../template/common');
  const tplTypeRoot = path.join(
    __dirname,
    `../template/${useTS ? 'ts' : 'js'}`
  );

  if (!fs.existsSync(projDir)) {
    try {
      info(
        `Creating basic directory structure${
          useTS ? chalk.blue(' for TypeScript template') : ''
        }...`
      );

      // Copy base "common" template
      await fsExtra.copy(tplRoot, appRoot);

      // Copy JS/TS specific files
      await fsExtra.copy(tplTypeRoot, appRoot, {
        overwrite: false,
        filter: filePath =>
          !filePath.includes('package.json') && !filePath.includes('.eslintrc'),
      });

      // Merge pkgJson files
      await mergePkgJson(tplRoot, tplTypeRoot, appRoot);

      // Copy eslintrc.js file
      await fsExtra.copy(
        path.join(tplTypeRoot, '.eslintrc.template.js'),
        path.join(appRoot, '.eslintrc.js')
      );
    } catch (err) {
      error(err.message);
      process.exit(1);
    }
  } else {
    error(
      `Aborting... the directory ${projDir} ${chalk.bold.red(
        'already exists'
      )}.\n`
    );
    process.exit(0);
  }

  // Overwrite package.json with new name
  const pkgJsonPath = path.join(appRoot, 'package.json');
  const pkgJson = JSON.parse(await fs.promises.readFile(pkgJsonPath, 'utf8'));

  pkgJson.name = projName;
  await fs.promises.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  // Determine package manager
  const pkgManager = usePNPM ? 'pnpm' : 'npm';

  // Run package manager install
  info(
    `Running ${chalk.magenta(
      `${pkgManager} install`
    )} inside app directory, this might take a while...`
  );

  console.log(chalk.dim('      Press CTRL+C to cancel.\n'));

  const npm = process.platform === 'win32' ? `${pkgManager}.cmd` : pkgManager;
  spawnSync(npm, ['install'], {
    stdio: 'inherit',
    cwd: appRoot,
  });

  // Show final info
  console.log('');
  info(`${chalk.bold.green('Success!')} Created ${chalk.magenta(
    projName
  )} inside the ${chalk.magenta(appRoot)} directory.

From there you can run several commands:

  ${chalk.blue(`${pkgManager} run test`)}
    To run test runners.

  ${chalk.blue(`${pkgManager} run lint`)}
    To run eslint on your application source files.

  ${chalk.blue(`${pkgManager} run dev`)}
    To start development server.

  ${chalk.blue(`${pkgManager} run build`)}
    To build the application.

  ${chalk.blue(`${pkgManager} run start`)}
    To start IMA.js application server.

We suggest that you start with:

  ${chalk.blue('cd')} ${projDir}
  ${chalk.blue(`${pkgManager} run dev`)}
`);
}
