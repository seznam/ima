import { toMockedInstance } from 'to-mock';

import ObjectContainer from 'ObjectContainer';
import ComponentUtils from 'page/renderer/ComponentUtils';

class SomeMockHelper {}

class SomeHelper {}

describe('ComponentUtils', () => {
  let componentUtils = null;

  const oc = toMockedInstance(ObjectContainer);

  beforeEach(() => {
    componentUtils = new ComponentUtils(oc);
  });

  describe('register() method', () => {
    it('should register utility class', () => {
      componentUtils.register('SomeHelper', SomeMockHelper);

      expect(componentUtils._utilityClasses['SomeHelper']).not.toBeUndefined();
      expect(componentUtils._utilityClasses['SomeHelper']).toEqual(
        SomeMockHelper
      );
    });

    it('should register multiple classes given in form of an Object.', () => {
      componentUtils.register({
        MockHelper: SomeMockHelper,
        SomeHelper
      });

      expect(componentUtils._utilityClasses['MockHelper']).toEqual(
        SomeMockHelper
      );
      expect(componentUtils._utilityClasses['SomeHelper']).toEqual(SomeHelper);
    });
  });

  describe('getUtils() method.', () => {
    beforeEach(() => {
      spyOn(oc, 'get').and.callFake(entity =>
        typeof entity === 'function' ? new entity() : entity
      );

      componentUtils.register({
        SomeMockHelper,
        SomeHelper
      });
    });

    it('should return $Utils constant from OC if created.', () => {
      spyOn(oc, 'has').and.callFake(entity => entity === '$Utils');

      componentUtils.getUtils();

      expect(oc.get).toHaveBeenCalledWith('$Utils');
    });

    it('should create instace of each registered class through OC.', () => {
      const utils = componentUtils.getUtils();

      expect(oc.get).toHaveBeenCalledTimes(2);
      expect(utils['SomeHelper'] instanceof SomeHelper).toBeTruthy();
      expect(utils['SomeMockHelper'] instanceof SomeMockHelper).toBeTruthy();
    });

    it('should not create instances again.', () => {
      const utils = (componentUtils._utilities = {});
      spyOn(componentUtils, '_createUtilityInstance').and.stub();

      expect(componentUtils.getUtils()).toBe(utils);
      expect(componentUtils._createUtilityInstance).not.toHaveBeenCalled();
    });
  });
});
