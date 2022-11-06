import { Config, Namespace, ObjectContainer, Router, Window } from '@ima/core';

// TODO incorrectly typed Config
export default (ns: Namespace, oc: ObjectContainer, config: Config) => {
  const $window = oc.get(Window) as Window;
  const $router = oc.get(Router) as Router;

  config.$IMA.fatalErrorHandler = error => {
    console.error('FATAL ERROR HANDLER:', error);
  };

  $window.bindEventListener($window.getWindow(), 'error', event => {
    const error = event.error;

    $router.handleError({ error }).catch(fatalError => {
      config.$IMA.fatalErrorHandler(fatalError);
    });
  });
};
