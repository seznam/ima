//import Dictionary from 'ima/dictionary/Dictionary';
//import MetaManager from 'ima/meta/MetaManager';
//import Router from 'ima/router/Router';
import AbstractPageController from 'app/page/AbstractPageController';
//import GenericError from 'ima/error/GenericError';

export default class HomeController extends AbstractPageController {
  static get $dependencies() {
    return [];
  }

  /**
   * Callback the controller uses to request the resources it needs to render
   * its view. This method is invoked after the {@codelink init()} method.
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
  load() {
    return {
      //error: Promise.reject(new GenericError('Try error page.')),
      //redirect: Promise.reject(new GenericError('Redirect from home page to error page for $Debug = false.', {status: 303, url: 'http://localhost:3001/not-found'})),
      message: `I am`,
      name: `IMA.js`
    };
  }

  /**
   * Callback used to configure the meta attribute manager. The method is called
   * after the the controller's state has been patched with the loaded
   * resources, the view has been rendered and (if at the client-side) the
   * controller has been provided with the rendered view.
   *
   * @override
   * @param {Object<string, *>} loadedResources Map of resource names to
   *        resources loaded by the {@codelink load} method. This is the same
   *        object as the one passed to the {@codelink setState} method when
   *        the Promises returned by the {@codelink load} method were resolved.
   * @param {MetaManager} metaManager Meta attributes manager to configure.
   * @param {Router} router The current application router.
   * @param {Dictionary} dictionary The current localization dictionary.
   * @param {Object<string, *>} settings The application settings for the
   *        current application environment.
   */
  setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
    let title = 'Isomorphic applications hello world - IMA.js';
    let description =
      'IMA.js is isomorphic javascript applications ' +
      'framework. The basic Hello World example. Just the running ' +
      'IMA.js with the only one page. This example is ideal base ' +
      'for new project.';
    let domain = router.getDomain();
    let image = domain + settings.$Static.image + '/imajs-share.png';

    let url = router.getUrl();

    metaManager.setTitle(title);

    metaManager.setMetaName('description', description);
    metaManager.setMetaName(
      'keywords',
      'IMA.js, isomorphic application, javascript, hello world'
    );

    metaManager.setMetaName('twitter:title', title);
    metaManager.setMetaName('twitter:description', description);
    metaManager.setMetaName('twitter:card', 'summary');
    metaManager.setMetaName('twitter:image', image);
    metaManager.setMetaName('twitter:url', url);

    metaManager.setMetaProperty('og:title', title);
    metaManager.setMetaProperty('og:description', description);
    metaManager.setMetaProperty('og:type', 'website');
    metaManager.setMetaProperty('og:image', image);
    metaManager.setMetaProperty('og:url', url);
  }
}
