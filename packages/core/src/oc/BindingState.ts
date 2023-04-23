export enum BindingState {
  /**
   * Constant for plugin binding state.
   *
   * When the object container is in plugin binding state, it is impossible
   * to register new aliases using the {@link bind()} method and register
   * new constant using the {@link constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@link inject()} method (classes that were not configured yet may be
   * configured using the {@link inject()} method or {@link provide()}
   * method).
   *
   * This prevents the unprivileged code (e.g. 3rd party plugins) from
   * overriding the default dependency configuration provided by ima, or
   * overriding the configuration of a 3rd party plugin by another 3rd party
   * plugin.
   *
   * The application itself has always access to the unlocked object
   * container.
   */
  Plugin = 'plugin',

  /**
   * Constant for IMA binding state.
   *
   * When the object container is in ima binding state, it is possible
   * to register new aliases using the {@link bind()} method and register
   * new constant using the {@link constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@link inject()} method (classes that were not configured yet may be
   * configured using the {@link inject()} method or {@link provide()}
   * method).
   *
   * @return The IMA binding state.
   */
  IMA = 'ima.core',

  /**
   * Constant for app binding state.
   *
   * When the object container is in app binding state, it is possible
   * to register new aliases using the {@link bind()} method and register
   * new constant using the {@link constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@link inject()} method (classes that were not configured yet may be
   * configured using the {@link inject()} method or {@link provide()}
   * method).
   */
  App = 'app',
}
