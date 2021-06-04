#!/usr/bin/env node

const path = require('path');

require('yargs')
  .scriptName('ima')
  .usage('Usage: $0 <command>')
  .commandDir(path.resolve(__dirname, '../scripts'))
  .demandCommand(1, 'You need to run at least one command to move on')
  .help()
  .wrap(null).argv;
