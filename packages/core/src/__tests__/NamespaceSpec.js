import { Namespace } from '../namespace';

describe('namespace', () => {
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

  it('should throw error when creating namespace with wrong path format', () => {
    expect(() => ns.namespace(false)).toThrow();
    expect(() => ns.namespace(1)).toThrow();
    expect(() => ns.namespace(null)).toThrow();
    expect(() => ns.namespace(undefined)).toThrow();
  });

  it('should throw error when getting wrong path format namespace value', () => {
    expect(() => ns.get(false)).toThrow();
    expect(() => ns.get(1)).toThrow();
    expect(() => ns.get(null)).toThrow();
    expect(() => ns.get(undefined)).toThrow();
  });

  it('should throw error when setting wrong path format', () => {
    expect(() => ns.set(false)).toThrow();
    expect(() => ns.set(1)).toThrow();
    expect(() => ns.set(null)).toThrow();
    expect(() => ns.set(undefined)).toThrow();
  });

  it('should return false when calling has wrong path format', () => {
    expect(() => ns.has(false)).not.toThrow();
    expect(ns.has(false)).toBeFalsy();

    expect(() => ns.has(1)).not.toThrow();
    expect(ns.has(1)).toBeFalsy();

    expect(() => ns.has(null)).not.toThrow();
    expect(ns.has(null)).toBeFalsy();

    expect(() => ns.has(undefined)).not.toThrow();
    expect(ns.has(undefined)).toBeFalsy();
  });
});
