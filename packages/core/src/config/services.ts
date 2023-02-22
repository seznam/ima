import { InitServices } from '../Bootstrap';
import { Dictionary } from '../dictionary/Dictionary';
import { Dispatcher } from '../event/Dispatcher';
import { UrlTransformer } from '../http/UrlTransformer';
import { PageManager } from '../page/manager/PageManager';
import { PageRenderer } from '../page/renderer/PageRenderer';
import { PageStateManager } from '../page/state/PageStateManager';
import { Request } from '../router/Request';
import { Response } from '../router/Response';
import { Router } from '../router/Router';
import { CookieStorage } from '../storage/CookieStorage';
import { SessionMapStorage } from '../storage/SessionMapStorage';
import { SessionStorage } from '../storage/SessionStorage';
import { Window } from '../window/Window';

export const initServices: InitServices = (ns, oc, config) => {
  oc.get<Dictionary>('$Dictionary').init(config.dictionary);
  oc.get<Dispatcher>('$Dispatcher').clear();

  if (!oc.get<Window>('$Window').isClient()) {
    oc.get<Request>('$Request').init(config.request);
    oc.get<Response>('$Response').init(
      config.response,
      oc.get('$CookieTransformFunction')
    );
    oc.get<CookieStorage>('$CookieStorage').clear();
    oc.get<SessionMapStorage>('$SessionStorage').clear();
    oc.get<Storage>('$CacheStorage').clear();
  }

  oc.get<CookieStorage>('$CookieStorage').init(
    { secure: oc.get<boolean>('$Secure') },
    oc.get('$CookieTransformFunction')
  );

  oc.get<SessionStorage>('$SessionStorage').init();
  oc.get<Storage>('$CacheStorage').init();
  oc.get<Router>('$Router').init(config.router);
  oc.get<PageManager>('$PageManager').init();
  oc.get<PageStateManager>('$PageStateManager').clear();
  oc.get<UrlTransformer>('$HttpUrlTransformer').clear();

  /**
   * HMR event handler to destroy existing application
   * before creating new one.
   */
  if ($Debug && typeof window !== 'undefined') {
    window.__IMA_HMR?.emitter?.once('destroy', async () => {
      // FIXME
      // oc.get<EventBus>('$EventBus').unlistenAll();
      oc.get<Dispatcher>('$Dispatcher').clear();
      await oc.get<PageManager>('$PageManager').destroy();
      oc.get<PageRenderer>('$PageRenderer').unmount();
      oc.get<Router>('$Router').unlisten();
    });
  }

  /**
   * HMR event handler to handle HMR ima app updates
   */
  if ($Debug && typeof window !== 'undefined') {
    window.__IMA_HMR?.emitter?.on('update', ({ type }) => {
      if (type === 'languages') {
        oc.get<Dictionary>('$Dictionary').init({
          ...config.dictionary,
          ...window?.$IMA?.i18n,
        });

        oc.get<Router>('$Router').route(window.location.pathname);
      }
    });
  }
};
