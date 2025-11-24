#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const [, , ...args] = process.argv;
const [pkgJsonPath, pkg, version] = args;

if (!pkg || !version || !pkgJsonPath) {
  console.error(
    'Usage: node utils/tests/setDependency.js <path-to-pkg.json> <pkg-name> <version>'
  );
  process.exit(1);
}

const pkgJsonFullPath = path.resolve(pkgJsonPath);

if (!fs.existsSync(pkgJsonFullPath)) {
  console.error(`File not found: ${pkgJsonFullPath}`);
  process.exit(1);
}

const pkgJsonContent = fs.readFileSync(pkgJsonFullPath, 'utf-8');
const pkgJson = JSON.parse(pkgJsonContent);

setDependency();

fs.writeFileSync(
  pkgJsonFullPath,
  JSON.stringify(pkgJson, null, 2) + '\n',
  'utf-8'
);
// eslint-disable-next-line no-console
console.log(`Updated ${pkg} to version ${version} in ${pkgJsonFullPath}`);

/**
 * Updates the dependency version in dependencies, devDependencies, or adds it to overrides.
 */
function setDependency() {
  if (pkgJson.dependencies && pkgJson.dependencies[pkg]) {
    pkgJson.dependencies[pkg] = version;
    return;
  }

  if (pkgJson.devDependencies && pkgJson.devDependencies[pkg]) {
    pkgJson.devDependencies[pkg] = version;
    return;
  }

  if (!pkgJson.overrides) {
    pkgJson.overrides = {};
  }

  pkgJson.overrides[pkg] = version;
}
