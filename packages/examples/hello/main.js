import initBindApp from 'app/config/bind';
import initRoutes from 'app/config/routes';
import initServicesApp from 'app/config/services';
import initSettings from 'app/config/settings';
import * as ima from 'ima/main';
import vendorLinker from 'ima/vendorLinker';

let getInitialAppConfigFunctions = () => {
	return { initBindApp, initRoutes, initServicesApp, initSettings };
};

if ($IMA.Test) {
	ima.reviveTestClientApp(getInitialAppConfigFunctions());
} else {
	ima.onLoad()
		.then(() => {
			if (!$IMA.HotReload) {
				ima.reviveClientApp(getInitialAppConfigFunctions());
			}
		})
		.catch((error) => {
			if (error) {
				console.error(error);
			}
		});
}

export {
	getInitialAppConfigFunctions,
	ima
};
