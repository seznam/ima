var react = require('react');
var reactDOM = require('react-dom');
var reactDOMServer = require('react-dom/server.js');
var superAgent = require('superagent');

// use vendor.set(...) to export libraries from the app/vendor module
vendor.set('React', react);
vendor.set('ReactDOM', reactDOM);
vendor.set('ReactDOMServer', reactDOMServer);
vendor.set('SuperAgent', superAgent);

/*
 var thirdPartyLibrary = require('thirdPartLibrary');
 vendorApp.set('ThirdPartyLibrary', thirdPartLibrary);
*/
