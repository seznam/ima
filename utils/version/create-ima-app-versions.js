const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.resolve(process.cwd(), 'packages');
const CIA_TEMPLATE_PACKAGE_JSON = path.resolve(
  PACKAGES_DIR,
  'create-ima-app/template/common/package.json'
);

if (!fs.existsSync(CIA_TEMPLATE_PACKAGE_JSON)) {
  throw Error(
    `Unable to update versions for create-ima-app. File at path ${CIA_TEMPLATE_PACKAGE_JSON} does not exist.`
  );
}

let packageJson = require(CIA_TEMPLATE_PACKAGE_JSON);

packageJson.devDependencies = resolvePackageVersions(
  packageJson.devDependencies
);
packageJson.dependencies = resolvePackageVersions(packageJson.dependencies);

fs.writeFileSync(
  CIA_TEMPLATE_PACKAGE_JSON,
  JSON.stringify(packageJson, null, 2) + '\n'
);

function resolvePackageVersions(dependencies) {
  Object.keys(dependencies).forEach(dependency => {
    if (dependency.startsWith('@ima/')) {
      let dependencyPackageJson = path.resolve(
        PACKAGES_DIR,
        dependency.split('@ima/')[1],
        'package.json'
      );

      if (fs.existsSync(dependencyPackageJson)) {
        let { version } = require(dependencyPackageJson);

        dependencies[dependency] = `${version}`;
      }
    }
  });

  return dependencies;
}
