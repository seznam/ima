describe('Revive client application', function() {

	var router = null;
	var React = ns.vendor.react;
	var ReactDOM = {
		render: function() { return { setState: function() {} }; }
	};

	var routerConfig = {
		$Protocol: 'http:',
		$Root: '',
		$LanguagePartPath: '',
		$Host: 'www.domain.com'
	};

	var options = {
		onlyUpdate: false,
		autoScroll: true,
		allowSPA: true,
		documentView: null
	};

	function Controller() {}

	function View() {
		return React.createElement('div', {});
	}

	Controller.prototype = Object.create(ns.ima.controller.Controller.prototype);
	Controller.prototype.constructor = Controller;
	Controller.prototype.getHttpStatus = function() { return 200; };
	Controller.prototype.getExtensions = function() { return []; };
	Controller.prototype.load = function() { return { hello: 'Hello' }; };

	beforeAll(function(done) {
		var app = $import('app/main', '*');

		oc.clear();
		app.ima.reviveTestClientApp(Object.assign({}, app.getInitialAppConfigFunctions(), { initBindApp: function(bindNs, bindOc, config) {
			router = bindOc.get('$Router');
			router.init(routerConfig);
			router.add('reviveClientApp', '/reviveClientApp', Controller, View, options);

			app.getInitialAppConfigFunctions().initBindApp(bindNs, bindOc, config);

			if (!bindOc.has('$Utils')) {
				bindOc.constant('$Utils', {});
			}
		} }));

		spyOn(oc.get('$ReactDOM'), 'render');
		spyOn(oc.get('$PageRendererFactory'), 'getDocumentView')
			.and
			.returnValue(function() {});

		oc.inject(Controller, []);

		done();
	});

	afterAll(function(done) {
		var app = $import('app/main', '*');

		oc.clear();
		app.ima.reviveTestClientApp(app.getInitialAppConfigFunctions());
		done();
	});

	it('should response with status code 200, content null and pageState', function(done) {
		router
			.route('/reviveClientApp')
			.then(function(response) {
				expect(response.status).toEqual(200);
				expect(response.content).toEqual(null);
				expect(response.pageState).toEqual({ hello: 'Hello' });
				done();
			})
			.catch(function(error) {
				console.error('INTEGRATION ERROR', error);
				done(error);
			});
	});


});
