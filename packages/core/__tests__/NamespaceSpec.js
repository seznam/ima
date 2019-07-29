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
});
