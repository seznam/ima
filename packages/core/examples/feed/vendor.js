
var react;
if ((typeof $Debug === 'undefined') || $Debug) {
	// use dev version of React in the dev environment
	react = require('react/dist/react.js');
} else {
	react = require('react/dist/react.min.js');
}
vendor.set('React', react); // use the vendor.set(...) method to export
							// libraries from the app/vendor module

var superAgent = require('superagent');
vendor.set('SuperAgent', superAgent);

/*
var thirdPartyLibrary = require('thirdPartLibrary');

vendorApp.set('ThirdPartyLibrary', thirdPartLibrary);
*/
