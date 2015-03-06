var vendor = new Map();

var react = require('react/addons');
var rsvp = require('rsvp');
var superAgent = require('superagent');

vendor.set('React', react);
vendor.set('Rsvp', rsvp);
vendor.set('SuperAgent', superAgent);

if (typeof window !== 'undefined' && window !== null) {
	window.$IMA = window.$IMA || {};
	window.$IMA.Vendor = vendor;
}