import ScrollHandler from 'page/handler/ScrollHandler';
import Window from 'window/Window';

jest.useFakeTimers();

describe('ima.page.handler.ScrollHandler', () => {
  let handler;
  let window;

  beforeEach(() => {
    window = new Window();
    handler = new ScrollHandler(window);
  });

  describe('handlePreManagedState() method', () => {
    it('should call window.replaceState method', () => {
      spyOn(window, 'replaceState').and.stub();

      handler.handlePreManagedState();

      expect(window.replaceState).toHaveBeenCalled();
    });
  });

  describe('handlePostManagedState() method', () => {
    it('should call window.scrollTo method', () => {
      spyOn(window, 'scrollTo').and.stub();

      const scroll = { x: 0, y: 340 };

      handler.handlePostManagedState(null, null, {
        event: { state: { scroll } }
      });

      jest.runAllTimers();
      expect(window.scrollTo).toHaveBeenCalledWith(scroll.x, scroll.y);
    });
  });
});
