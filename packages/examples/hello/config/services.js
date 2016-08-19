export let init = (ns, oc, config) => { // jshint ignore:line
	let $window = oc.get('$Window');
	let $router = oc.get('$Router');

	config.$IMA.fatalErrorHandler = (e) => {
		console.error('FATAL ERROR HANDLER:', e);
	};

	$window.bindEventListener($window.getWindow(), 'error', (e) => {
		let error = e.error;

		$router
			.handleError({ error })
			.catch((fatalError) => {
				config.$IMA.fatalErrorHandler(fatalError);
			});
	});
};
