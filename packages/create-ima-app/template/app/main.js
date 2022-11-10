import './less/app.less';

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
      if ($Debug && module.hot && typeof window !== 'undefined') {
        window.__IMA_HMR?.emit('destroy');
      }

      ima.reviveClientApp(getInitialAppConfigFunctions());
    })
    .catch(error => {
      if (error) {
        if ($Debug && typeof window !== 'undefined') {
          window.__IMA_HMR?.emit('error', { error });
        }

        console.error(error);
      }
    });
}

if (module.hot) {
  module.hot.accept((error, { module }) => {
    typeof window !== 'undefined' &&
      window.__IMA_HMR?.emit('error', { error, module });
    console.error('Failed to hot replace module:', module);
  });
}

export { getInitialAppConfigFunctions, ima };
