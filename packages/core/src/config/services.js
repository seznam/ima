export default (ns, oc, config) => {
  oc.get('$Dictionary').init(config.dictionary);
  oc.get('$Dispatcher').clear();

  if (!oc.get('$Window').isClient()) {
    oc.get('$Request').init(config.request);
    oc.get('$Response').init(
      config.response,
      oc.get('$CookieTransformFunction')
    );
    oc.get('$CookieStorage').clear();
    oc.get('$SessionStorage').clear();
    oc.get('$CacheStorage').clear();
  }

  oc.get('$CookieStorage').init(
    { secure: oc.get('$Secure') },
    oc.get('$CookieTransformFunction')
  );

  oc.get('$SessionStorage').init();
  oc.get('$CacheStorage').init();
  oc.get('$Router').init(config.router);
  oc.get('$PageManager').init();
  oc.get('$PageStateManager').clear();
  oc.get('$HttpUrlTransformer').clear();

  /**
   * HMR event handler to destroy existing application
   * before creating new one.
   */
  if ($Debug && typeof window !== 'undefined') {
    window.__IMA_HMR?.emitter?.on(
      'destroy',
      () => {
        oc.get('$Router').unlisten();
        oc.get('$EventBus').unlistenAll();
        oc.get('$PageManager').destroy();
        oc.get('$PageRenderer').unmount();
        oc.get('$Dispatcher').clear();
      },
      true
    );
  }
};
