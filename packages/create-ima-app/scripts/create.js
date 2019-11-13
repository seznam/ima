const execa = require('execa');
const fs = require('fs');
const fsx = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const argv = require('yargs').argv;
const { info, error } = require('../utils/printUtils');

const dir = argv._[0];

let exampleResolver = argv.example
  ? Promise.resolve({ example: argv.example })
  : inquirer.prompt([
      {
        type: 'list',
        name: 'example',
        message: 'Choose a template for your new IMA.js application:',
        choices: [
          {
            name: `${chalk.bold.blue(
              'Empty'
            )} - The basic Hello World example. Ideal for new projects.`,
            value: 'hello'
          },
          {
            name: `${chalk.bold.blue(
              'Todos'
            )} - Demo example of TodoMVC application.`,
            value: 'todos'
          },
          {
            name: `${chalk.bold.blue(
              'Feed'
            )}  - Demo example of twitter-like application with fake REST API.`,
            value: 'feed'
          }
        ]
      }
    ]);

exampleResolver.then(({ example }) => {
  createImaApp(dir, example);
});

function createImaApp(dirName, exampleName) {
  info(
    `Creating new IMA.js app inside ${chalk.green(dirName)} directory...`,
    true
  );

  const projName = dirName.split(path.sep).pop();
  const appRoot = path.resolve(dirName.toString());
  const tplRoot = path.join(__dirname, '../template');
  const exampleRoot = path.resolve(
    __dirname,
    `../node_modules/@ima/examples/${exampleName}`
  );

  if (!fs.existsSync(exampleRoot)) {
    error(`Example '${exampleName}' is not defiend.`);
    process.exit(1);
  }

  if (!fs.existsSync(dirName)) {
    try {
      info(`Creating basic directory structure...`);
      fsx.copySync(tplRoot, appRoot);
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

  // Copy example files into ./app directory
  if (exampleName !== 'hello') {
    info(`Copying ${chalk.cyan(exampleName)} example files...`);
  }

  fsx.copySync(exampleRoot, path.join(appRoot, 'app'));

  // Run npm install
  info(
    `Running ${chalk.cyan(
      'npm install'
    )} inside app directory, this might take a while...`
  );
  // eslint-disable-next-line no-console
  console.log(chalk.dim('      Press CTRL+C to cancel.\n'));

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  execa.sync(npm, ['install'], {
    stdio: 'inherit',
    cwd: appRoot
  });

  // Init git repo
  info('Initializing git repository...', true);
  execa.sync('git', ['init'], { cwd: appRoot });

  // Show final info
  info(`${chalk.bold('Success!')} Created ${chalk.cyan(
    projName
  )} inside ${chalk.green(appRoot)} directory.

From there you can run several commands:

  ${chalk.cyan('npm run test')}
    To start test runners.

  ${chalk.cyan('npm run lint')}
    To run eslint on your application source files.

  ${chalk.cyan('npm run dev')}
    To start development server.

  ${chalk.cyan('npm run build')}
    To build the application.

  ${chalk.cyan('npm run build:spa')}
    To build SPA version of the application.

  ${chalk.cyan('npm run start')}
    To start IMA.js server.

We suggest that you start with:

  ${chalk.cyan('cd')} ${dirName}
  ${chalk.cyan('npm run dev')}
`);
}
