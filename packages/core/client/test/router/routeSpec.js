describe('Core.Router.Route', function() {

	var route = null;
	var name = 'home';
	var pathExpression = '/home/:userId/something/:somethingId';
	var regular = '^\\/home\\/([^\\/?]+)\\/something\\/([^\\/?]+)(?:\\?(?:.+=.+)(?:&.+=.+)*)?$';

	beforeEach(function() {
		route = oc.create('Core.Router.Route', name, pathExpression,'home');
	});

	describe('should be create right path', function() {

		using([
			{userId: 1, somethingId: 2},
			{userId: 2, somethingId: 'job'},
			{userId: 'hello', somethingId: 'job'}
		], function(value){
			it('for path params. userId:' + value.userId + ', somethingId:' + value.somethingId, function(){
				expect(route.createPathForParams(value)).toEqual('/home/' + value.userId + '/something/' + value.somethingId);
			});
		});

		it('for empty variables will be return defined path', function() {
			expect(route.createPathForParams()).toEqual(pathExpression);
		});

		it('for path and query variables', function() {
			var value = {userId: 'hello', somethingId: 'job', query1: 'query', query2: 'text for you'};

			expect(route.createPathForParams(value)).toEqual('/home/' + value.userId + '/something/' + value.somethingId + '?query1=query&query2=' + encodeURIComponent(value.query2));
		});

	});

	it('should be return route name', function() {
		expect(route.getName()).toEqual(name);
	});

	it('should be return route path', function() {
		expect(route.getPathExpression()).toEqual(pathExpression);
	});

	it('should be return regular', function() {
		expect(route.getRegular()).toEqual(regular);
	});

	describe('should get params from path', function() {

		using([
			{pathExpression: '/:userId', path: '/user12', params:{userId: 'user12'}},
			{pathExpression: '/home/:userId/something/:somethingId', path: '/home/1/something/2', params:{userId: '1', somethingId: '2'}},
			{pathExpression: '/home/:userId/something/:somethingId', path: '/home/1/something', params:{userId: undefined, somethingId: undefined}},
			{pathExpression: '/home/:userId/something/:somethingId', path: '/home/param1/something/param2', params:{userId: 'param1', somethingId: 'param2'}},
			{pathExpression: '/home/:userId/something/:somethingId', path: '/home/param1/something/param2?query=param3', params:{userId: 'param1', somethingId: 'param2', query: 'param3'}}
		], function(value) {
			it(value.pathExpression, function() {
				var routeLocal = oc.create('Core.Router.Route', 'unknown', value.pathExpression, 'unknown');

				var routeParams = routeLocal.getParamsForPath(value.path);
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
				expect(route.isMatch(value.path)).toEqual(value.result);
			});
		});

	});


	describe('should return true for matched route and false for unmatched route', function() {

		using([
			{pathExpression: '/',path: '/', result:true},
			{pathExpression: '/',path: '/something', result:false},
			{pathExpression: '/:param1',path: '/', result:false},
			{pathExpression: '/:param1',path: '/param1', result:true},
			{pathExpression: '/:param1',path: '/param1/', result:true},
			{pathExpression: '/something',path: '/something/', result:true},
			{pathExpression: '/something/:param1',path: '/something/param1/', result:true},
			{pathExpression: '/something/:param1',path: '/something/param1?query=query', result:true},
			{pathExpression: '/something/:param1',path: '/something/param1/param2/param3/', result: false},
			{pathExpression: '/something/:param1/neco/:param2',path: '/something/param1/neco/param2', result: true}
		], function(value) {
			it('for pathExpression ' + value.pathExpression + ' and path ' + value.path, function() {
				var routeLocal = oc.create('Core.Router.Route', 'unknown', value.pathExpression,'unknown');

				expect(routeLocal.isMatch(value.path)).toEqual(value.result);
			});
		});

	});

});