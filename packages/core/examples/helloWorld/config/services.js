export var init = (ns, oc, config) => { // jshint ignore:line
	var $window = oc.get('$Window');

	config.$IMA.fatalErrorHandler = (e) => {
		console.error('FATAL ERROR HANDLER:', e);
	};

	$window.bindEventListener($window.getWindow(), 'error', (e) => {
		if (oc.has('$Router')) {
			oc
				.get('$Router')
				.handleError(e.error)
		}
	});
};
