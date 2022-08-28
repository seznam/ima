module.exports = {
  projects: ['<rootDir>/packages/*/jest.config.js'],
  watchPlugins: [
    'jest-watch-select-projects',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
