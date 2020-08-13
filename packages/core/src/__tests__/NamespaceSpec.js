import { Namespace } from '../namespace';

describe('Namespace', () => {
  let ns = null;
  let path = 'a.b.c.ClassConstructor';
  class ClassConstructor {}

  beforeEach(() => {
    ns = new Namespace();
    ns.namespace(path);
  });

  it('should create defined namespace', () => {
    expect(ns.a.b.c.ClassConstructor).toEqual({});
  });

  it('should return stored value in namespace', () => {
    expect(ns.get(path)).toEqual({});
  });

  it('should return true if namespace exists', () => {
    expect(ns.has(path)).toEqual(true);
  });

  it('should set value for defined namespace', () => {
    ns.set(path, ClassConstructor);

    expect(ns.a.b.c.ClassConstructor).toEqual(ClassConstructor);
  });

  it('Should return undefined when creating namespace with wrong path format', () => {
    expect(ns.namespace(false)).toEqual(undefined);
    expect(ns.namespace(1)).toEqual(undefined);
    expect(ns.namespace(null)).toEqual(undefined);
    expect(ns.namespace(undefined)).toEqual(undefined);
  });

  it('Should return undefined when getting wrong path format namespace value', () => {
    expect(ns.get(false)).toEqual(undefined);
    expect(ns.get(1)).toEqual(undefined);
    expect(ns.get(null)).toEqual(undefined);
    expect(ns.get(undefined)).toEqual(undefined);
  });

  it('Should return undefined when setting wrong path format', () => {
    expect(ns.set(false)).toEqual(undefined);
    expect(ns.set(1)).toEqual(undefined);
    expect(ns.set(null)).toEqual(undefined);
    expect(ns.set(undefined)).toEqual(undefined);
  });
});
