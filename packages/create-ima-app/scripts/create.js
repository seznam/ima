import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import fs from 'fs-extra';

import { info, error } from './utils.js';

(async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projDir = process.argv[2];

  info(
    `Creating new IMA.js application inside the ${chalk.magenta(
      projDir
    )} directory...`,
    true
  );

  const projName = projDir.split(path.sep).pop();
  const appRoot = path.resolve(projDir.toString());
  const tplRoot = path.join(__dirname, '../template');

  if (!fs.existsSync(projDir)) {
    try {
      info(`Creating basic directory structure...`);
      fs.copySync(tplRoot, appRoot);
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
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

  pkgJson.name = projName;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  // Run npm install
  info(
    `Running ${chalk.magenta(
      'npm install'
    )} inside app directory, this might take a while...`
  );

  console.log(chalk.dim('      Press CTRL+C to cancel.\n'));

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
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

  ${chalk.blue('npm run test')}
    To run test runners.

  ${chalk.blue('npm run lint')}
    To run eslint on your application source files.

  ${chalk.blue('npm run dev')}
    To start development server.

  ${chalk.blue('npm run build')}
    To build the application.

  ${chalk.blue('npm run start')}
    To start IMA.js application server.

We suggest that you start with:

  ${chalk.blue('cd')} ${projDir}
  ${chalk.blue('npm run dev')}
`);
})();
