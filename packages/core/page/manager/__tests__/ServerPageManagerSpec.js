import ServerPageManager from 'page/manager/ServerPageManager';
import PageRenderer from 'page/renderer/PageRenderer';
import PageStateManager from 'page/state/PageStateManager';

describe('ima.page.manager.ServerPageManager', () => {
  let pageFactory = {
    createController: Controller => new Controller(),
    decorateController: controller => controller,
    decoratePageStateManager: pageStateManger => pageStateManger,
    createView: view => view
  };
  let pageRenderer = null;
  let stateManager = null;
  let pageManager = null;

  beforeEach(() => {
    pageRenderer = new PageRenderer();
    stateManager = new PageStateManager();
    pageManager = new ServerPageManager(
      pageFactory,
      pageRenderer,
      stateManager
    );
  });

  it('scrollTo method should be override', () => {
    expect(() => {
      pageManager.scrollTo(0, 0);
    }).not.toThrow();
  });
});
