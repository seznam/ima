export var init = (ns, oc, config) => { // jshint ignore:line
	var $window = oc.get('$Window');
	var $router = oc.get('$Router');

	config.$IMA.fatalErrorHandler = (e) => {
		console.error('FATAL ERROR HANDLER:', e);
	};

	$window.bindEventListener($window.getWindow(), 'error', (e) => {
		var error = e.error;

		$router
			.handleError({ error })
			.catch((fatalError) => {
				config.$IMA.fatalErrorHandler(fatalError);
			});
	});
};
