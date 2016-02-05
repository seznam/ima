var vendorApp = vendor || new Map(); // jshint ignore:line

var react = require('react');
var reactDOM = require('react-dom');
var reactDOMServer = require('react-dom/server.js');
var superAgent = require('superagent');

// use the vendorApp.set(...) method to export
// libraries from the app/vendor module
vendorApp.set('React', react);
vendorApp.set('ReactDOM', reactDOM);
vendorApp.set('ReactDOMServer', reactDOMServer);
vendorApp.set('SuperAgent', superAgent);

/*
 var thirdPartyLibrary = require('thirdPartLibrary');

 vendorApp.set('ThirdPartyLibrary', thirdPartLibrary);
 */
