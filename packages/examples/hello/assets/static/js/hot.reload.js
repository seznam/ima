(function() {
	console.log('HOT RELOADING');

	window.addEventListener('fb-flo-reload', function(ev) {
		console.log("Resource " + ev.data.url + " has just been replaced.");

		if (/static\/js\//.test(ev.data.url)) {
			$IMA.$DevTool.clearAppSource();
			$IMA.HotReload = true;

			(0, eval)(ev.data.contents);

			$IMA.Loader
				.import('imajs/client/main')
				.then((main) => {
					main.hotReloadIMAJsClientApp();
				}).catch((error) => {
					console.error(error);
				});

			$IMA.HotReload = false;
		}
	});
})();
