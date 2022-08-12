import MapStorage from '../MapStorage';
import SessionMapStorage from '../SessionMapStorage';

describe('ima.storage.SessionMapStorage', () => {
  let sessionMap;
  let mapStorage = null;
  let sessionStorage = null;

  beforeEach(() => {
    mapStorage = new MapStorage();
    sessionStorage = new MapStorage();
    sessionMap = new SessionMapStorage(mapStorage, sessionStorage);

    sessionMap.init();
    sessionMap.clear();
  });

  afterEach(() => {
    sessionMap.clear();
  });

  it('should set and get items', () => {
    sessionMap.set('item1', 1);
    expect(sessionMap.get('item1')).toBe(1);

    sessionMap.set('item2', 'test');
    expect(sessionMap.get('item2')).toBe('test');

    sessionMap.set('item3', false);
    expect(sessionMap.get('item3')).toBeFalsy();

    let obj = { testedProp: 'testedValue' };
    sessionMap.set('item4', obj);
    expect(sessionMap.get('item4')).toStrictEqual(obj);

    let arr = [0, 'val', true, {}];
    sessionMap.set('item5', arr);
    expect(sessionMap.get('item5')).toStrictEqual(arr);
  });

  it('should set promise value only to map storage', () => {
    jest.spyOn(sessionStorage, 'set').mockImplementation();

    sessionMap.set('promise', Promise.resolve(1));

    expect(sessionStorage.set).not.toHaveBeenCalled();
  });

  it('should should have (not) an item', () => {
    expect(sessionMap.has('item1')).toBeFalsy();
    sessionMap.set('item1', 1);
    expect(sessionMap.has('item1')).toBeTruthy();
  });

  it('should clear all items', () => {
    sessionMap.set('item1', 1).set('item2', 'test').set('item3', false).clear();

    expect(sessionMap.has('item1')).toBeFalsy();
    expect(sessionMap.has('item2')).toBeFalsy();
    expect(sessionMap.has('item3')).toBeFalsy();
  });

  it('should delete selected items only', () => {
    sessionMap
      .set('item1', 1)
      .set('item2', 'test')
      .set('item3', false)
      .delete('item1')
      .delete('item3');

    expect(sessionMap.has('item1')).toBeFalsy();
    expect(sessionMap.has('item2')).toBeTruthy();
    expect(sessionMap.has('item3')).toBeFalsy();
  });

  it('should return keys', () => {
    sessionMap.set('item1', 1).set('item2', 'test').set('item3', false);

    let index = 0;
    let iterator = sessionMap.keys();
    let item = iterator.next();

    do {
      switch (index++) {
        case 0:
          // eslint-disable-next-line jest/no-conditional-expect
          expect(item.value).toBe('item1');
          break;
        case 1:
          // eslint-disable-next-line jest/no-conditional-expect
          expect(item.value).toBe('item2');
          break;
        default:
          // eslint-disable-next-line jest/no-conditional-expect
          expect(item.value).toBe('item3');
          break;
      }
      item = iterator.next();
    } while (item.done !== true);
  });
});
