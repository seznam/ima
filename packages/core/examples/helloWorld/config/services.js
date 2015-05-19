export var init = (ns, oc, config) => { // jshint ignore:line
	var $window = oc.get('$Window');

	$window.bindEventListener($window.getWindow(), 'error', (e) => {
		if (oc.has('$Router')) {
			oc
				.get('$Router')
				.handleError(e.error)
				.catch((fatalError) => {
					console.error('FATAL ERROR HANDLER:', e);
				});
		}
	});
};
