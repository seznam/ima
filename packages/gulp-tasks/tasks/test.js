
let karma = require('karma');
let path = require('path');

let sharedState = require('../gulpState.js');

exports.test_unit_karma = test_unit_karma;
function test_unit_karma(done) {
	sharedState.karmaServer = new karma.Server({
		configFile: path.resolve('./karma.conf.js'),
		singleRun: true
	}, done).start();
}

exports.test_unit_karma_dev = test_unit_karma_dev;
function test_unit_karma_dev(done) {
	sharedState.karmaServer = new karma.Server({
		configFile: path.resolve('./karma.conf.js')
	}, done).start();
}
