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
		serveSPA: true
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
		$IMA.Loader
			.import('app/main')
			.then(function(app) {
				oc.clear();
				app.ima.reviveTestClientApp(Object.assign({}, app.getInitialAppConfigFunctions(), { initBindApp: function(bindNs, bindOc, config) {
					bindOc.bind('$PageRenderer', bindNs.ima.page.renderer.ClientPageRenderer, ['$PageRendererFactory', '$Helper', ReactDOM, '$Settings', '$Window']);
					router = bindOc.get('$Router');
					router.init(routerConfig);
					router.add('reviveClientApp', '/reviveClientApp', Controller, View, options);

					app.getInitialAppConfigFunctions().initBindApp(bindNs, bindOc, config);
				} }));

				oc.inject(Controller, []);

				done();
			});
	});

	afterAll(function(done) {
		$IMA.Loader
			.import('app/main')
			.then(function(app) {
				oc.clear();
				app.ima.reviveTestClientApp(app.getInitialAppConfigFunctions());
				done();
			});
	});

	it('should response with status code 200 and content null', function(done) {
		router
			.route('/reviveClientApp')
			.then(function(response) {
				expect(response.status).toEqual(200);
				expect(response.content).toEqual(null);
				done();
			})
			.catch(function(error) {
				console.error('ERROR', error);
				done(error);
			});
	});


});
