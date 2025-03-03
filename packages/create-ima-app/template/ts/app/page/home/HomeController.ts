import {
  LoadedResources,
  Dependencies,
  Dictionary,
  HttpAgent,
  MetaManager,
  Router,
  Settings,
  AbstractController,
} from '@ima/core';
import IMAjsShareImg from 'app/public/imajs-share.png';

export type CardData = typeof import('../../public/cards.json');
export type HomeControllerState = {
  cards: Promise<CardData>;
  message: string;
  name: string;
};

export class HomeController extends AbstractController<HomeControllerState> {
  #httpAgent: HttpAgent;

  static $dependencies: Dependencies = [HttpAgent];

  constructor(httpAgent: HttpAgent) {
    super();

    this.#httpAgent = httpAgent;
  }

  load(): HomeControllerState {
    /**
     * Fetch cards data from static JSON file using IMA HttpAgent.
     * HttpAgent is implementation based on native fetch api with some
     * additional features. It handles fetching data on client but also
     * on server isomorphically.
     */
    const cardsPromise = this.#httpAgent
      .get<CardData>('http://localhost:3001/static/static/public/cards.json')
      .then(response => response.body);

    return {
      cards: cardsPromise,
      message: 'Welcome to',
      name: `IMA.js`,
    };
  }

  /**
   * Callback the controller uses to request the resources it needs to render
   * its view. This method is invoked after the {@link init()} method.
   *
   * The controller should request all resources it needs in this method, and
   * represent each resource request as a promise that will resolve once the
   * resource is ready for use (these can be data fetch over HTTP(S), database
   * connections, etc).
   *
   * The controller must return a map object. The field names of the object
   * identify the resources being fetched and prepared, the values must be the
   * Promises that resolve when the resources are ready to be used.
   *
   * The returned map object may also contain fields that have non-Promise
   * value. These can be used to represent static data, or initial value of
   * controller's state that will change due to user interaction, or resource
   * that has been immediately available (for example fetched from the DOM
   * storage).
   *
   * The system will wait for all promises to resolve, and then push them to
   * the controller's state using the field names used in the returned map
   * object.
   *
   * @override
   * @return {Object<string, (Promise|*)>} A map object of promises
   *         resolved when all resources the controller requires are ready. The
   *         resolved values will be pushed to the controller's state.
   */

  /**
   * Callback used to configure the meta attribute manager. The method is called
   * after the controller's state has been patched with the loaded
   * resources, the view has been rendered and (if at the client-side) the
   * controller has been provided with the rendered view.
   */
  setMetaParams(
    loadedResources: LoadedResources<HomeControllerState>,
    metaManager: MetaManager,
    router: Router,
    dictionary: Dictionary,
    settings: Settings
  ): void {
    const title = 'Isomorphic applications hello world - IMA.js';
    const description =
      'IMA.js is isomorphic javascript applications ' +
      'framework. The basic Hello World example. Just the running ' +
      'IMA.js with the only one page. This example is ideal base ' +
      'for new project.';

    const url = router.getUrl();
    const domain = router.getDomain();
    const image = `${domain}/${IMAjsShareImg}`;

    metaManager
      .setTitle(title)
      .setMetaName('description', description)
      .setMetaName('keywords', 'IMA.js, isomorphic application, javascript')
      .setMetaName('twitter:title', title)
      .setMetaName('twitter:description', description)
      .setMetaName('twitter:card', 'summary')
      .setMetaName('twitter:image', image)
      .setMetaName('twitter:url', url)
      .setMetaProperty('og:title', title)
      .setMetaProperty('og:description', description)
      .setMetaProperty('og:type', 'website')
      .setMetaProperty('og:image', image)
      .setMetaProperty('og:url', url);
  }
}
