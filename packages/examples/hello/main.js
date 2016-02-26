import { init as initBindApp } from 'app/config/bind';
import { init as initRoutes } from 'app/config/routes';
import { init as initServicesApp } from 'app/config/services';
import { init as initSettings } from 'app/config/settings';
import * as ima from 'ima/main';

let getInitialAppConfigFunctions = () => {
	return { initBindApp, initRoutes, initServicesApp, initSettings };
};

if ($IMA.Test) {
	ima.reviveTestClientApp(getInitialAppConfigFunctions());
} else {

	ima.onLoad(() => {
		if (!$IMA.HotReload) {
			ima.reviveClientApp(getInitialAppConfigFunctions());
		}
	});

}

export {
	getInitialAppConfigFunctions,
	ima
};
