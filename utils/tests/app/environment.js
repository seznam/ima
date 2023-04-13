const environment = require('./environment.orig.js');

environment.prod.$Server.clusters = 1;
environment.prod.$Server.overloadConcurrency = undefined;
environment.prod.$Server.serveSPA.allow = false;
environment.prod.$Server.cache.enabled = false;

environment.test.$Server.concurrency = 0;
environment.test.$Server.serveSPA = { allow: true };

environment.test.$Server.protocol = 'https';

module.exports = environment;
