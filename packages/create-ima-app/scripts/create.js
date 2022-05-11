const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const argv = require('yargs').argv;
const { info, error } = require('../utils');

createImaApp(argv._[0]);

function createImaApp(dirName) {
  info(
    `Creating new IMA.js application inside the ${chalk.magenta(
      dirName
    )} directory...`,
    true
  );

  const projName = dirName.split(path.sep).pop();
  const appRoot = path.resolve(dirName.toString());
  const tplRoot = path.join(__dirname, '../template');

  if (!fs.existsSync(dirName)) {
    try {
      info(`Creating basic directory structure...`);
      fs.mkdirSync(appRoot, { recursive: true });
      fs.copySync(tplRoot, appRoot);
    } catch (err) {
      error(err.message);
      process.exit(1);
    }
  } else {
    error(
      `Aborting... the directory ${dirName} ${chalk.bold.red(
        'already exists'
      )}.\n`
    );
    process.exit(0);
  }

  // Overwrite package.json with new name
  const pkgJsonPath = path.join(appRoot, 'package.json');
  const pkgJson = require(pkgJsonPath);

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
  execa.sync(npm, ['install', ['--legacy-peer-deps']], {
    // TODO IMA@18 -> remove --legacy-peer-deps
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

  ${chalk.blue('cd')} ${dirName}
  ${chalk.blue('npm run dev')}
`);
}
