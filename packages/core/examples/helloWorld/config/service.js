export var init = (ns, oc, config) => { // jshint ignore:line

	config.$IMA.fatalErrorHandler = (e) => {
		console.error('FATAL ERROR HANDLER:', e);
	};

};
