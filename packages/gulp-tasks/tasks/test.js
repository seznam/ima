
let karma = require('karma');
let path = require('path');

let sharedState = require('../gulpState.js');

exports['test:unit:karma'] = testUnitKarma;
function testUnitKarma(done) {
	sharedState.karmaServer = new karma.Server({
		configFile: path.resolve('./karma.conf.js'),
		singleRun: true
	}, done).start();
}

exports['test:unit:karma:dev'] = testUnitKarmaDev;
function testUnitKarmaDev(done) {
	sharedState.karmaServer = new karma.Server({
		configFile: path.resolve('./karma.conf.js')
	}, done).start();
}
