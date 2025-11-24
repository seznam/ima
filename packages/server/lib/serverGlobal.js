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
        `Server global doesn't have key named '${name}'. Check your workflow.`
      );
    }

    return this._global.get(name);
  }

  delete(name) {
    return this._global.delete(name);
  }
}

const serverGlobal = new ServerGlobal();
serverGlobal.clear();

module.exports = serverGlobal;
