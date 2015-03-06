var items = require('./api.items')();
var validator = require('./api.validator')();

module.exports = () => {

	var urls = [
		{method: 'GET', host: 'www.horoskop.dev', port: 80, path: '/'},
		{method: 'GET', host: 'www.horoskop.dev', port: 80, path: '/rak'},
		{method: 'GET', host: 'api.horoskop.dev', port: 80, path: '/signs', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'_embedded.[signs=12]', structure: items.sign}]},
		{method: 'GET', host: 'www.horoskop.dev', port: 80, path: '/error', status: 500},
		{method: 'GET', host: 'www.horoskop.dev', port: 80, path: '/notFound', status: 404},
		{method: 'GET', host: 'www.horoskop.test', port: 80, path: '/'},
		{method: 'GET', host: 'www.horoskop.test', port: 80, path: '/rak'},
		{method: 'GET', host: 'api.horoskop.test', port: 80, path: '/signs', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'_embedded.[signs=12]', structure: items.sign}]},
		{method: 'GET', host: 'api.horoskop.dev', port: 80, path: '/current-user', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'', structure: items.currentUser}], headers: {Authorization: 'anon:54ca40c428ee720017753946', Cookie: 'userAuth=anon:54ca40c428ee720017753946'}},
		//{method: 'GET', host: 'api.horoskop.test', port: 80, path: '/current-user', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'', structure: items.currentUser}], headers: {Authorization: 'anon:54c9008e91860e001e0da5d6', Cookie: 'userAuth=anon:54c9008e91860e001e0da5d6'}},
		//{method: 'GET', host: 'api.horoskop.dev', port: 80, path: '/feeds/54ca40c428ee720017753946', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'[feedItems>0]', structure: items.feedItems}], headers: {Authorization: 'anon:54ca40c428ee720017753946', Cookie: 'userAuth=anon:54ca40c428ee720017753946'}},
		//{method: 'GET', host: 'api.horoskop.test', port: 80, path: '/feeds/54c9008e91860e001e0da5d6', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'[feedItems>0]', structure: items.feedItems}], headers: {Authorization: 'anon:54c9008e91860e001e0da5d6', Cookie: 'userAuth=anon:54c9008e91860e001e0da5d6'}},
		{method: 'GET', host: 'api.horoskop.dev', port: 80, path: '/feeds/rak', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'[feedItems>0]', structure: items.feedItems}], headers: {Authorization: 'anon:54ca40c428ee720017753946', Cookie: 'userAuth=anon:54ca40c428ee720017753946'}},
		//{method: 'GET', host: 'api.horoskop.test', port: 80, path: '/feeds/rak', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'[feedItems>0]', structure: items.feedItems}], headers: {Authorization: 'anon:54c9008e91860e001e0da5d6', Cookie: 'userAuth=anon:54c9008e91860e001e0da5d6'}}
	];

/*	urls = [
		{method: 'GET', host: 'api.horoskop.dev', port: 80, path: '/feeds/rak', preProcessor: validator.halsonPreProcessor, processor: validator.parseStructure, tests: [{name:'[feedItems>0]', structure: items.feedItems}], headers: {Authorization: 'anon:54ca40c428ee720017753946', Cookie: 'userAuth=anon:54ca40c428ee720017753946'}}
	];*/

	return urls;
};