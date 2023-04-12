import { InitServicesFunction, Router, Window } from '@ima/core';

export const initServicesApp: InitServicesFunction = (ns, oc, config) => {
  const $window = oc.get(Window);
  const $router = oc.get(Router);

  config.$IMA.fatalErrorHandler = error => {
    console.error('FATAL ERROR HANDLER:', error);
  };

  $window.bindEventListener($window.getWindow()!, 'error', event => {
    const error = event.error;

    $router.handleError({ error }).catch(fatalError => {
      config.$IMA.fatalErrorHandler!(fatalError as Error);
    });
  });
};
