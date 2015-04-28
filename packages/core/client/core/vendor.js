var vendor = new Map();

var react = require('react/dist/react.min.js');
var rsvp = require('rsvp');
var superAgent = require('superagent');
var helper = require('./helper.js');

vendor.set('React', react);
vendor.set('Rsvp', rsvp);
vendor.set('SuperAgent', superAgent);
vendor.set('Helper', helper);


if (typeof window !== 'undefined' && window !== null) {
	window.$IMA = window.$IMA || {};
	window.$IMA.Vendor = vendor;
}