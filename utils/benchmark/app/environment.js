const environment = require('./environment.orig.js');

environment.prod.$Server.clusters = 1;
environment.prod.$Server.serveSPA.allow = false;
environment.prod.$Server.cache.enabled = false;

module.exports = environment;
