var vendorApp = vendor || new Map(); // jshint ignore:line

var react = require('react/dist/react.min.js');
var superAgent = require('superagent');

vendorApp.set('React', react);
vendorApp.set('SuperAgent', superAgent);

/*
 var thirdPartLibary = require('thirdPartLibary');

 vendorApp.set('ThirdPartLibary', thirdPartLibary);
 */
