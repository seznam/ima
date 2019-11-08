import { Dictionary, Dispatcher, EventBus, Router, Window } from '@ima/core';

//eslint-disable-next-line no-unused-vars
export default (ns, oc, config) => {
  oc.constant('$Utils', {
    get $Router() {
      return oc.get(Router);
    },
    get $Dispatcher() {
      return oc.get(Dispatcher);
    },
    get $EventBus() {
      return oc.get(EventBus);
    },
    get $Dictionary() {
      return oc.get(Dictionary);
    },
    get $Settings() {
      return oc.get('$Settings');
    },
    get $Window() {
      return oc.get(Window);
    },
    get $CssClasses() {
      return oc.get('$CssClasses');
    }
  });
};
