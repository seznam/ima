/**
 * @pmmmwh/react-refresh-webpack-plugin interface module.
 * Since we use the plugin only to inject proper handlers for the
 * react fast refresh plugin and not for it's error overlay features
 * (which we handle ourselves). We want to mock these functions so they
 * don't do anything.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export {
  noop as handleRuntimeError,
  noop as clearRuntimeErrors,
  noop as clearCompileError,
};
