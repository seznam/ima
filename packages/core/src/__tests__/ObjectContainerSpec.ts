/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ns } from '../Namespace';
import { BindingState } from '../oc/BindingState';
import { Entry } from '../oc/Entry';
import { ObjectContainer } from '../oc/ObjectContainer';
import { UnknownParameters } from '../types';

describe('ima.core.ObjectContainer', () => {
  let oc: ObjectContainer;

  class ClassConstructorWithDependencies {
    dependency: unknown;

    static get $dependencies() {
      return [];
    }

    constructor(dependency: unknown) {
      this.dependency = dependency;
    }
  }

  const alias = 'alias';
  const alias2 = 'alias2';
  class ClassParent {}
  class ClassConstructor extends ClassParent {
    dependency: unknown;

    constructor(dependency: unknown) {
      super();

      this.dependency = dependency;
    }
  }

  class ClassDependency {}
  const dependencies = [ClassDependency, ClassConstructorWithDependencies];

  const constantName = 'constant';
  const constantValue = 'value';
  const constantObjectName = 'constantObject';
  const constantCompositionName = 'constantObject.path.to.property';
  const constantObjectProperty = 'property';
  const constantObjectValue = {
    path: { to: { property: constantObjectProperty } },
  };

  const spreadConstantName = 'spreadConstant';
  const spreadConstantValue = [ClassParent, ClassParent];

  const namespacePathUnit = 'test.unit';
  const namespacePathOC = 'test.unit.ObjectContainer';
  ns.namespace(namespacePathUnit);

  beforeEach(() => {
    oc = new ObjectContainer(ns);
  });

  it('should be empty object container', () => {
    expect(oc['_entries'].size).toBe(0);
  });

  it('should be clear entries', () => {
    jest.spyOn(oc['_entries'], 'clear').mockImplementation();

    oc.clear();

    expect(oc['_entries'].clear).toHaveBeenCalled();
  });

  describe('constant method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should be throw Error, if you want to re-set constant value for simple constant name', () => {
      oc.constant(constantName, constantValue);

      expect(() => {
        oc.constant(constantName, constantValue);
      }).toThrow();
    });

    it('should be throw Error, if you want to re-set constant value for composition name', () => {
      oc.constant(constantObjectName, constantObjectValue);

      expect(() => {
        oc.constant(constantCompositionName, constantObjectProperty);
      }).toThrow();
    });

    it('should be throw Error, if you want to set constatn in plugin', () => {
      oc.setBindingState(BindingState.Plugin);

      expect(() => {
        oc.constant(constantObjectName, constantObjectValue);
      }).toThrow();
    });

    it('should be set constant value', () => {
      jest.spyOn(oc, '_createEntry');

      oc.constant(constantName, constantValue);

      expect(oc._createEntry).toHaveBeenCalled();
      expect(oc['_entries'].get(constantName)!.sharedInstance).toBe(
        constantValue
      );
    });
  });

  describe('inject method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should throw error, if ClassConstructor parameter is not function', () => {
      expect(() => {
        // @ts-ignore
        oc.inject(alias, dependencies);
      }).toThrow();
    });

    it('should throw error, if ClassConstructor is registered and object container is locked for plugin', () => {
      oc.inject(ClassConstructor, dependencies);
      oc.setBindingState(BindingState.Plugin);

      expect(() => {
        oc.inject(ClassConstructor, dependencies);
      }).toThrow();
    });

    it('should be create new instance of entry and set it to entries', () => {
      jest.spyOn(oc, '_createEntry');

      oc.inject(ClassConstructor, dependencies);

      expect(
        oc['_entries'].get(ClassConstructor)!.classConstructor
      ).toStrictEqual(ClassConstructor);
      expect(oc['_entries'].get(ClassConstructor)!.dependencies).toStrictEqual(
        dependencies
      );
      expect(oc._createEntry).toHaveBeenCalledWith(
        ClassConstructor,
        dependencies
      );
      expect(oc['_entries'].size).toBe(1);
    });

    it('should set instance of entry from aliases to the entries', () => {
      jest.spyOn(oc, '_createEntry');

      oc.bind(alias, ClassConstructor, dependencies);
      oc.inject(ClassConstructor, dependencies);

      expect(
        oc['_entries'].get(ClassConstructor)!.classConstructor
      ).toStrictEqual(ClassConstructor);
      expect(oc['_entries'].get(ClassConstructor)!.dependencies).toStrictEqual(
        dependencies
      );
      expect(oc['_entries'].size).toBe(2);
      expect(oc._createEntry).toHaveBeenCalledTimes(1);
      expect(oc['_entries'].get(ClassConstructor)).toStrictEqual(
        oc['_entries'].get(alias)
      );
    });

    it('should be throw error, if yow call inject more then 2 times for same ClassConstructor', () => {
      oc.inject(ClassConstructor, dependencies);
      oc.inject(ClassConstructor, dependencies);

      expect(() => {
        oc.inject(ClassConstructor, dependencies);
      }).toThrow();
    });
  });

  describe('bind method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should be throw Error if classconstructor param is not type of function', () => {
      expect(() => {
        // @ts-ignore
        oc.bind(alias, {}, dependencies);
      }).toThrow();
    });

    it('should be throw Error if object container is locked', () => {
      oc.setBindingState(BindingState.Plugin);

      expect(() => {
        oc.bind(alias, ClassConstructor, dependencies);
      }).toThrow();
    });

    it('should be create new entry for defined dependencies', () => {
      jest.spyOn(oc, '_createEntry');

      oc.bind(alias, ClassConstructor, dependencies);

      expect(oc._createEntry).toHaveBeenCalledWith(
        ClassConstructor,
        dependencies
      );
    });

    it('should be use entry from entries which was defined by inject method', () => {
      oc.inject(ClassConstructor, dependencies);

      jest.spyOn(oc, '_createEntry');

      oc.bind(alias, ClassConstructor);

      expect(oc._createEntry).toHaveBeenCalledTimes(0);
      expect(oc['_entries'].get(alias)).toStrictEqual(
        oc['_entries'].get(ClassConstructor)
      );
    });

    it('should be use entry from entries which was defined by provide method', () => {
      oc.provide(ClassParent, ClassConstructor, dependencies);

      jest.spyOn(oc, '_createEntry');

      oc.bind(alias, ClassParent);

      expect(oc._createEntry).toHaveBeenCalledTimes(0);
      expect(oc['_entries'].get(alias)).toStrictEqual(
        oc['_entries'].get(ClassParent)
      );
    });

    it('should use entry from entries which was provided and binded', () => {
      oc.provide(ClassParent, ClassConstructor, dependencies);
      oc.bind(alias, ClassParent);
      const aliasEntry = oc['_entries'].get(alias);

      jest.spyOn(oc, '_updateEntryValues');

      oc.bind(
        alias,
        ClassConstructorWithDependencies,
        ClassConstructorWithDependencies.$dependencies
      );

      expect(oc._updateEntryValues).toHaveBeenCalledWith(
        aliasEntry,
        ClassConstructorWithDependencies,
        ClassConstructorWithDependencies.$dependencies
      );
      expect(aliasEntry!.classConstructor).toStrictEqual(
        ClassConstructorWithDependencies
      );
      expect(aliasEntry!.dependencies).toStrictEqual(
        ClassConstructorWithDependencies.$dependencies
      );
    });

    it('should create new entry for unregistered alias with defined dependencies, it is feature for AB tests', () => {
      oc.inject(ClassConstructor, dependencies);
      oc.bind(alias, ClassConstructor);

      jest.spyOn(oc, '_createEntry');

      oc.bind(alias2, ClassConstructor, []);

      expect(oc._createEntry).toHaveBeenCalledTimes(1);
      expect(oc['_entries'].get(alias2)).not.toStrictEqual(
        oc['_entries'].get(ClassConstructor)
      );
      expect(oc['_entries'].get(alias2)!.dependencies).toStrictEqual([]);
    });
  });

  describe('provide method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should be throw Error if you call provide method more times for same interfaceConstructor in plugin', () => {
      oc.setBindingState(BindingState.Plugin);
      oc.provide(ClassParent, ClassConstructor, dependencies);

      expect(() => {
        oc.provide(ClassParent, ClassConstructor, dependencies);
      }).toThrow();
    });

    it('should be throw Error, if interface is not match with implementation', () => {
      expect(() => {
        oc.provide(ClassDependency, ClassConstructor, dependencies);
      }).toThrow();
    });

    it('should be create new Entry and set it to entries', () => {
      jest.spyOn(oc, '_createEntry');

      oc.provide(ClassParent, ClassConstructor, dependencies);

      expect(oc._createEntry).toHaveBeenCalledTimes(1);
      expect(oc['_entries'].size).toBe(2);
    });
  });

  describe('has method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should return true if name is exist in object container', () => {
      oc.inject(ClassConstructor, dependencies);

      expect(oc.has(ClassConstructor)).toBeTruthy();
      expect(oc.has(namespacePathUnit)).toBeTruthy();
    });

    it('should return true if ClassConstructor has defined $dependencies property', () => {
      expect(oc.has(ClassConstructorWithDependencies)).toBeTruthy();
    });

    it('should return false if name is not exist in object container', () => {
      // @ts-ignore
      global.$Debug = false;
      expect(oc.has(namespacePathOC)).toBeFalsy();
      expect(oc.has(ClassConstructor)).toBeFalsy();
      // @ts-ignore
      global.$Debug = true;
    });

    it('should throw if class is not in object container', () => {
      expect(() => {
        oc.has(ClassConstructor);
      }).toThrow();
    });
  });

  describe('get method', () => {
    let entry: Entry;

    beforeEach(() => {
      entry = {
        sharedInstance: null,
        classConstructor: ClassConstructor,
        dependencies: dependencies,
      } as Entry;
    });

    it('should return shared instance', () => {
      entry.sharedInstance = false;

      jest.spyOn(oc, '_getEntry').mockReturnValue(entry);
      jest.spyOn(oc, '_createInstanceFromEntry').mockImplementation();

      expect(oc.get('entry')).toStrictEqual(entry.sharedInstance);
      expect(oc._createInstanceFromEntry).toHaveBeenCalledTimes(0);
    });

    it('should create new instance', () => {
      jest.spyOn(oc, '_getEntry').mockReturnValue(entry);
      jest.spyOn(oc, '_createInstanceFromEntry').mockImplementation();

      oc.get('entry');

      expect(oc._createInstanceFromEntry).toHaveBeenCalledWith(entry);
    });

    it('should find optional aliased entity', () => {
      oc.bind(alias, ClassParent);
      const entry = oc.get('?' + alias);

      expect(entry).not.toStrictEqual(ClassParent);
      expect(entry).toBeDefined();
      expect(entry).toBeInstanceOf(ClassParent);
    });

    it('should not find optional aliased entity', () => {
      const entry = oc.get('?undefined');

      expect(entry).toBeUndefined();
    });

    it('should not find aliased entity and throw', () => {
      expect(() => {
        oc.get('undefined');
      }).toThrow();
    });

    it('should find optional entity', () => {
      oc.bind(alias, ClassParent);
      const entry = oc.get([alias, { optional: true }]);

      expect(entry).not.toStrictEqual(ClassParent);
      expect(entry).toBeDefined();
      expect(entry).toBeInstanceOf(ClassParent);
    });

    it('should not find optional entity', () => {
      const entry = oc.get(['undefined', { optional: true }]);

      expect(entry).toBeUndefined();
    });

    it('should find non optional entity', () => {
      oc.bind(alias, ClassParent);
      const entry = oc.get([alias, { optional: false }]);

      expect(entry).not.toStrictEqual(ClassParent);
    });

    it('should not find non optional entity and throw', () => {
      expect(() => {
        oc.get(['undefined', { optional: false }]);
      }).toThrow();
    });

    it('should find optional class entity', () => {
      oc.bind(alias, ClassParent);
      const entry = oc.get([ClassParent, { optional: true }]);

      expect(entry).not.toStrictEqual(ClassParent);
      expect(entry).toBeDefined();
      expect(entry).toBeInstanceOf(ClassParent);
    });

    it('should spread dependencies', () => {
      oc.bind(alias, ClassParent);
      oc.constant(spreadConstantName, spreadConstantValue);

      const entry = oc.get(
        '...' + spreadConstantName
      ) as typeof spreadConstantValue;

      expect(entry).toHaveLength(2);
      expect(entry[0]).not.toStrictEqual(ClassParent);
    });

    it('should spread dependencies with optional parameter', () => {
      oc.bind(alias, ClassParent);
      oc.constant(spreadConstantName, [
        ...spreadConstantValue,
        ['undefined', { optional: true }],
      ]);

      const entry = oc.get(
        '...' + spreadConstantName
      ) as typeof spreadConstantValue;

      expect(entry).toHaveLength(3);
      expect(entry[2]).toBeUndefined();
    });

    it('should throw with undefined spread dependencies', () => {
      oc.constant(spreadConstantName, spreadConstantValue);

      expect(() => {
        oc.get('...' + spreadConstantName);
      }).toThrow();
    });

    it('should create new entry when spread', () => {
      oc.bind(alias, ClassParent);
      oc.constant(spreadConstantName, spreadConstantValue);

      const entry1 = oc.get(
        '...' + spreadConstantName
      ) as typeof spreadConstantValue;
      const entry2 = oc.get(spreadConstantName) as typeof spreadConstantValue;
      const entry3 = oc.get(
        '...?' + spreadConstantName
      ) as typeof spreadConstantValue;

      expect(entry1[0]).toStrictEqual(entry3[0]);
      expect(entry1[0]).not.toStrictEqual(entry2[0]);
    });

    it('should not spread dependencies', () => {
      oc.bind(alias, ClassParent);
      oc.constant(spreadConstantName, spreadConstantValue);

      const entry = oc.get(spreadConstantName) as typeof spreadConstantValue;

      expect(entry).toHaveLength(2);
      expect(entry[0]).toStrictEqual(ClassParent);
    });
  });

  describe('_getEntry method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should be throw Error for undefined identification of entry', () => {
      expect(() => {
        oc._getEntry(() => {
          return;
        });
      }).toThrow();

      expect(() => {
        oc._getEntry('undefined');
      }).toThrow();
    });

    it('should be return entry from constants', () => {
      oc.constant(constantName, constantValue);

      expect((oc._getEntry(constantName) as Entry).sharedInstance).toBe(
        constantValue
      );
    });

    it('should be return entry from aliases', () => {
      oc.bind(alias, ClassConstructor, dependencies);

      const entry = oc._getEntry(alias) as Entry;

      expect(entry.classConstructor).toStrictEqual(ClassConstructor);
      expect(entry.dependencies).toStrictEqual(dependencies);
    });

    it('should be return value from registry', () => {
      oc.inject(ClassConstructor, dependencies);

      const entry = oc._getEntry(ClassConstructor) as Entry;

      expect(entry.classConstructor).toStrictEqual(ClassConstructor);
      expect(entry.dependencies).toStrictEqual(dependencies);
    });

    it('should be return value from namespace', () => {
      const value = { a: 1 };
      const namespace = ns.get(namespacePathUnit);
      (namespace as UnknownParameters).ObjectContainer = value;

      const entry = oc._getEntry(namespacePathOC) as Entry;

      expect(entry.sharedInstance).toStrictEqual(value);
    });

    it('should be return value from registry for class constructor with $dependencies', () => {
      const entry = oc._getEntry(ClassConstructorWithDependencies) as Entry;

      expect(entry.classConstructor).toStrictEqual(
        ClassConstructorWithDependencies
      );
      expect(entry.dependencies).toStrictEqual(
        ClassConstructorWithDependencies.$dependencies
      );
    });
  });

  describe('_getEntryFromConstant method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should return entry by name from stored constants', () => {
      oc.constant(constantObjectName, constantObjectValue);

      const entry = oc._getEntryFromConstant(constantObjectName) as Entry;

      expect(entry.sharedInstance).toStrictEqual(constantObjectValue);
    });

    it('should return entry by composition name to property from stored constants', () => {
      oc.constant(constantObjectName, constantObjectValue);

      const entry = oc._getEntryFromConstant(constantCompositionName) as Entry;

      expect(entry.sharedInstance).toStrictEqual(constantObjectProperty);
    });

    it('should return null for bad type of composition name', () => {
      oc.constant(constantObjectName, constantObjectValue);

      const entry = oc._getEntryFromConstant(() => {
        return;
      });

      expect(entry).toBeNull();
    });
  });

  describe('_getEntryFromNamespace method', () => {
    let namespace: unknown;
    beforeEach(() => {
      namespace = ns.get(namespacePathUnit);
      (namespace as UnknownParameters).ObjectContainer = ClassConstructor;

      oc.clear();
    });

    it('should be return entry from registry', () => {
      oc.inject(ClassConstructor, dependencies);

      const entry = oc._getEntryFromNamespace(namespacePathOC) as Entry;

      expect(entry.classConstructor).toStrictEqual(ClassConstructor);
      expect(entry.dependencies).toStrictEqual(dependencies);
    });

    it('should be create new entry if namespace return function with zero dependencies and their dependencies is not injected', () => {
      (namespace as UnknownParameters).ObjectContainer = ClassDependency;

      jest.spyOn(oc, '_createEntry');

      const entry = oc._getEntryFromNamespace(namespacePathOC) as Entry;

      expect(entry.classConstructor).toStrictEqual(ClassDependency);
      expect(entry.dependencies).toStrictEqual([]);
    });

    it('should be create entry with constant value if namespace return another type than function', () => {
      const constant = { a: 1 };
      (namespace as UnknownParameters).ObjectContainer = constant;

      jest.spyOn(oc, '_createEntry');

      const entry = oc._getEntryFromNamespace(namespacePathOC) as Entry;

      expect(entry.sharedInstance).toStrictEqual(constant);
    });
  });

  describe('_getEntryFromClassConstructor method', () => {
    beforeEach(() => {
      oc.clear();
    });

    it('should return null if ClassConstructor is not a function', () => {
      expect(oc._getEntryFromClassConstructor('')).toBeNull();
    });

    it('should return null for not defined $dependencies property', () => {
      // @ts-ignore
      global.$Debug = false;
      expect(oc._getEntryFromClassConstructor(ClassConstructor)).toBeNull();
      // @ts-ignore
      global.$Debug = true;
    });

    it('should throw for not defined $dependencies property in $Debug', () => {
      expect(() => {
        oc._getEntryFromClassConstructor(ClassConstructor);
      }).toThrow();
    });

    it('should set class to entries if class has defined $dependencies', () => {
      jest.spyOn(oc, '_createEntry');

      oc._getEntryFromClassConstructor(ClassConstructorWithDependencies);

      expect(oc._createEntry).toHaveBeenCalledWith(
        ClassConstructorWithDependencies,
        ClassConstructorWithDependencies.$dependencies
      );
      expect(oc['_entries'].size).toBe(1);
    });

    it('should return entry if class has defined $dependencies', () => {
      const entry = oc._getEntryFromClassConstructor(
        ClassConstructorWithDependencies
      ) as Entry;

      expect(entry.classConstructor).toStrictEqual(
        ClassConstructorWithDependencies
      );
      expect(entry.dependencies).toStrictEqual(
        ClassConstructorWithDependencies.$dependencies
      );
    });
  });
});
