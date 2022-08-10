const defaultResolver = require('jest-resolve').default;
const packageConfig = require('./package.json');
const path = require('path');

/**
 * Mock rules for this modules resolver
 *
 * @param {object<string, array>} mockRules
 * @example mockRules: {
 *   myPath: [{ fileA.js: './__mocks__/fileA.js'}, { mobuleB: './__mocks__/moduleB.js' }]
 * }
 */
const { mockRules = {} } = packageConfig.jestConfig || {};

const BASE_DIR = process.cwd() + path.sep;

const getFilePath = (baseDir, filePath) => {
  const dir = baseDir.replace(BASE_DIR, '').replace(/\\/g, '/');

  // eslint-disable-next-line no-prototype-builtins
  const dirReplaceRules = mockRules.hasOwnProperty(dir) ? mockRules[dir] : [];

  const replaceRule = dirReplaceRules.find(rule => {
    return filePath === Object.keys(rule)[0];
  });

  return replaceRule ? replaceRule[filePath] : filePath;
};

module.exports = (filePath, options) => {
  const usedFilePath = getFilePath(options.basedir, filePath);

  return defaultResolver(usedFilePath, options);
};
