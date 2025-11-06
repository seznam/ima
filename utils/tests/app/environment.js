const environment = require('./environment.orig.js');

environment.prod = {
  ...environment.prod,
  $Server: {
    ...environment.prod?.$Server,
    clusters: 1,
    overloadConcurrency: undefined,
    cache: {
      ...environment.prod?.$Server?.cache,
      enabled: false,
    },
  },
};

module.exports = environment;
