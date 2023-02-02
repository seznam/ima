const fs = require('fs');

const CONFIG_PATH = './.changeset/config.json';

function modifyBaseBranch(branch) {
  const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
  const output = content.replace(
    /"baseBranch": ".*"/,
    `"baseBranch": "${branch}"`
  );

  fs.writeFileSync(CONFIG_PATH, output, 'utf-8');
}

modifyBaseBranch(process.argv[2]);
