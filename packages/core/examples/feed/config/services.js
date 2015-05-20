export var init = (ns, oc, config) => { // jshint ignore:line
	var $window = oc.get('$Window');
	var $router = oc.get('$Router');

	$window.bindEventListener($window.getWindow(), 'error', (e) => {
		$router
		.handleError(e.error)
		.catch((fatalError) => {
			console.error('FATAL ERROR HANDLER:', e);
		});
	});
};