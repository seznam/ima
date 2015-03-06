describe('Core.Router.Data', function() {

	var routerData = null;
	var name = 'home';
	var path = '/home/:userId/something/:somethingId';
	var regular = '^\\/home\\/([^\\/?]+)\\/something\\/([^\\/?]+)(?:\\?(?:.+=.+)(?:&.+=.+)*)?$';

	beforeEach(function() {
		routerData = ns.oc.create('Core.Router.Data', name, path,'home');
	});

	describe('should be create right path', function() {

		using([
			{userId: 1, somethingId: 2},
			{userId: 2, somethingId: 'job'},
			{userId: 'hello', somethingId: 'job'}
		], function(value){
			it('for path variables. userId:' + value.userId + ', somethingId:' + value.somethingId, function(){
				expect(routerData.createPath(value)).toEqual('/home/' + value.userId + '/something/' + value.somethingId);
			});
		});

		it('for empty variables will be return defined path', function() {
			expect(routerData.createPath()).toEqual(path);
		});

		it('for path and query variables', function() {
			var value = {userId: 'hello', somethingId: 'job', query1: 'query', query2: 'text for you'};

			expect(routerData.createPath(value)).toEqual('/home/' + value.userId + '/something/' + value.somethingId + '?query1=query&query2=' + encodeURIComponent(value.query2));
		});

	});

	it('should be return route name', function() {
		expect(routerData.getName()).toEqual(name);
	});

	it('should be return route path', function() {
		expect(routerData.getPath()).toEqual(path);
	});

	it('should be return regular', function() {
		expect(routerData.getRegular()).toEqual(regular);
	});

	describe('should get params from path', function() {

		using([
			{path: '/:userId', url: '/user12', params:{userId: 'user12'}},
			{path: '/home/:userId/something/:somethingId', url: '/home/1/something/2', params:{userId: '1', somethingId: '2'}},
			{path: '/home/:userId/something/:somethingId', url: '/home/1/something', params:{userId: undefined, somethingId: undefined}},
			{path: '/home/:userId/something/:somethingId', url: '/home/param1/something/param2', params:{userId: 'param1', somethingId: 'param2'}},
			{path: '/home/:userId/something/:somethingId', url: '/home/param1/something/param2?query=param3', params:{userId: 'param1', somethingId: 'param2', query: 'param3'}}
		], function(value) {
			it(value.path, function() {
				var routerDataLocal = ns.oc.create('Core.Router.Data', 'unknown', value.path,'unknown');

				var routeParams = routerDataLocal.getParams(value.url);
				var keys = Object.keys(value.params);

				for (var i = 0; i < keys.length; i++) {
					expect(routeParams[keys[i]]).toEqual(value.params[keys[i]]);
				}
			});
		});

	});

	describe('should return true for matched route regular', function() {

		using([
			{path: '/home/1/something/2', result:true},
			{path: '/home/1/something', result:false},
			{path: '/home/param1/something/param2', result: true},
			{path: '/home/param1/something/param2?query=param3', result: true}
		], function(value) {
			it(value.path, function() {
				expect(routerData.isMatch(value.path)).toEqual(value.result);
			});
		});

	});


	describe('should return true for matched route and false for unmatched route', function() {

		using([
			{path: '/',url: '/', result:true},
			{path: '/',url: '/something', result:false},
			{path: '/:param1',url: '/', result:false},
			{path: '/:param1',url: '/param1', result:true},
			{path: '/:param1',url: '/param1/', result:true},
			{path: '/something',url: '/something/', result:true},
			{path: '/something/:param1',url: '/something/param1/', result:true},
			{path: '/something/:param1',url: '/something/param1?query=query', result:true},
			{path: '/something/:param1',url: '/something/param1/param2/param3/', result: false},
			{path: '/something/:param1/neco/:param2',url: '/something/param1/neco/param2', result: true}
		], function(value) {
			it('for path ' + value.path + ' and url ' + value.url, function() {
				var routerDataLocal = ns.oc.create('Core.Router.Data', 'unknown', value.path,'unknown');

				expect(routerDataLocal.isMatch(value.url)).toEqual(value.result);
			});
		});

	});

});