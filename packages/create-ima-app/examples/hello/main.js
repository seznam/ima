import './assets/less/app.less';
import './assets/less/setting.less';
import './assets/less/base.less';
import './assets/less/layout.less';

import * as ima from '@ima/core';
import initBindApp from 'app/config/bind';
import initRoutes from 'app/config/routes';
import initServicesApp from 'app/config/services';
import initSettings from 'app/config/settings';

let getInitialAppConfigFunctions = () => {
  return { initBindApp, initRoutes, initServicesApp, initSettings };
};

if (!$IMA.Test) {
  ima
    .onLoad()
    .then(() => {
      if (module.hot && $IMA.$Dispatcher) {
        $IMA.$Dispatcher.fire('destroyIma');
      }

      ima.reviveClientApp(getInitialAppConfigFunctions());
    })
    .catch(error => {
      if (error) {
        console.error(error);
      }
    });
}

if (module.hot) {
  module.hot.accept();
}

export { getInitialAppConfigFunctions, ima };
