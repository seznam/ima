var vendorApp = vendor || new Map();

var react = require('react/dist/react.min.js');
var superAgent = require('superagent');

vendorApp.set('React', react);
vendorApp.set('SuperAgent', superAgent);
