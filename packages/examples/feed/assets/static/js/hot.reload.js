(function() {
	console.log('HOT RELOADING');

	window.addEventListener('fb-flo-reload', function(ev) {
		console.log("Resource " + ev.data.url + " has just been replaced.");

		if (/static\/js\//.test(ev.data.url)) {
			$IMA.$DevTool.clearAppSource();

			(0, eval)(ev.data.contents);

			$IMA.HotReload = true;

			$IMA.Loader.initAllModules()
				.then(function() {

					return $IMA.Loader
						.import('app/main')
						.then(function(appMain) {
							appMain.ima.hotReloadClientApp(appMain.getInitialAppConfigFunctions());

							$IMA.HotReload = false;
						});
				}).catch(function(error) {
					console.error(error);
				});

		}
	});
})();
