export var init = (ns, config) => { // jshint ignore:line

	config.$IMA.fatalErrorHandler = (e) => {
		console.error('FATAL ERROR HANDLER:', e);
	};

};
