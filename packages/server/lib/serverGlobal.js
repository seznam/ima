// TODO IMA@18 remove and use Observer on 'request' and 'response' hook

module.exports = (() => {
  'use strict';

  /**
   * Server Global variables.
   *
   * @class ServerGlobal
   */
  class ServerGlobal {
    constructor() {
      this._global = new Map();
    }

    clear() {
      this._global.clear();
    }

    has(name) {
      return this._global.has(name);
    }

    set(name, value) {
      return this._global.set(name, value);
    }

    get(name) {
      if (!this.has(name)) {
        throw new Error(
          `Server global hasn't key with '${name}'. Check your workflow.`
        );
      }

      return this._global.get(name);
    }
  }

  const serverGlobal = new ServerGlobal();
  serverGlobal.clear();

  return serverGlobal;
})();
