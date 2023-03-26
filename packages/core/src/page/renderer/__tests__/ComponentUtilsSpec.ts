import { toMockedInstance } from 'to-mock';

import { ObjectContainer } from '../../../oc/ObjectContainer';
import { ComponentUtils } from '../ComponentUtils';

class SomeMockHelper {}

class SomeHelper {}

describe('componentUtils', () => {
  let componentUtils: ComponentUtils;

  const oc = toMockedInstance(ObjectContainer);

  beforeEach(() => {
    componentUtils = new ComponentUtils(oc);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register() method', () => {
    it('should register utility class', () => {
      componentUtils.register('SomeHelper', SomeMockHelper);

      expect(componentUtils['_utilityClasses']['SomeHelper']).toBeDefined();
      expect(componentUtils['_utilityClasses']['SomeHelper']).toStrictEqual(
        SomeMockHelper
      );
    });

    it('should register multiple classes given in form of an Object.', () => {
      componentUtils.register({
        MockHelper: SomeMockHelper,
        SomeHelper,
      });

      expect(componentUtils['_utilityClasses']['MockHelper']).toStrictEqual(
        SomeMockHelper
      );
      expect(componentUtils['_utilityClasses']['SomeHelper']).toStrictEqual(
        SomeHelper
      );
    });
  });

  describe('getUtils() method.', () => {
    beforeEach(() => {
      jest
        .spyOn(oc, 'get')
        .mockImplementation(entity =>
          typeof entity === 'function' ? new entity() : entity
        );

      componentUtils.register({
        SomeMockHelper,
        SomeHelper,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return $Utils constant from OC if created.', () => {
      jest.spyOn(oc, 'has').mockImplementation(entity => entity === '$Utils');

      componentUtils.getUtils();

      expect(oc.get).toHaveBeenCalledWith('$Utils');
    });

    it('should create instace of each registered class through OC.', () => {
      const utils = componentUtils.getUtils();

      expect(oc.get).toHaveBeenCalledTimes(2);
      // @ts-expect-error error expected
      expect(utils['SomeHelper'] instanceof SomeHelper).toBeTruthy();
      // @ts-expect-error error expected
      expect(utils['SomeMockHelper'] instanceof SomeMockHelper).toBeTruthy();
    });

    it('should not create instances again.', () => {
      // @ts-expect-error error expected
      const utils = (componentUtils['_utilities'] = {});
      jest.spyOn(componentUtils, '_createUtilityInstance').mockImplementation();

      expect(componentUtils.getUtils()).toBe(utils);
      expect(componentUtils._createUtilityInstance).not.toHaveBeenCalled();
    });
  });
});
