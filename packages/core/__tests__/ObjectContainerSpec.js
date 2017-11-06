import ObjectContainer from 'ObjectContainer';
import ns from 'namespace';

describe('ima.ObjectContainer', () => {
	let oc = null;

	function classConstructorWithDependencies(dependency) {
		this.dependecy = dependency;
	}
	classConstructorWithDependencies.$dependencies = [];

	let alias = 'alias';
	let alias2 = 'alias2';
	let classParent = function mockClassParent() {
		this.parent = this;
	};
	let classConstructor = function mockClassConstructor(dependency) {
		this.dependency = dependency;
	};
	let classDependency = function mockDependency() {};
	let dependencies = [classDependency, classConstructorWithDependencies];
	extend(classConstructor, classParent);

	let constantName = 'constant';
	let constantValue = 'value';
	let constantObjectName = 'constantObject';
	let constantCompositionName = 'constantObject.path.to.property';
	let constantObjectProperty = 'property';
	let constantObjectValue = {
		path: { to: { property: constantObjectProperty } }
	};

	let namespacePathUnit = 'test.unit';
	let namespacePathOC = 'test.unit.ObjectContainer';
	ns.namespace(namespacePathUnit);

	beforeEach(() => {
		oc = new ObjectContainer(ns);
	});

	it('should be empty object container', () => {
		expect(oc._entries.size).toEqual(0);
	});

	it('should be clear entries', () => {
		spyOn(oc._entries, 'clear').and.stub();

		oc.clear();

		expect(oc._entries.clear).toHaveBeenCalled();
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
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);

			expect(() => {
				oc.constant(constantObjectName, constantObjectValue);
			}).toThrow();
		});

		it('should be set constant value', () => {
			spyOn(oc, '_createEntry').and.callThrough();

			oc.constant(constantName, constantValue);

			expect(oc._createEntry).toHaveBeenCalled();
			expect(oc._entries.get(constantName).sharedInstance).toEqual(
				constantValue
			);
		});
	});

	describe('inject method', () => {
		beforeEach(() => {
			oc.clear();
		});

		it('should throw error, if classConstructor parameter is not function', () => {
			expect(() => {
				oc.inject(alias, dependencies);
			}).toThrow();
		});

		it('should throw error, if classConstructor is registered and object container is locked for plugin', () => {
			oc.inject(classConstructor, dependencies);
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);

			expect(() => {
				oc.inject(classConstructor, dependencies);
			}).toThrow();
		});

		it('should be create new instance of entry and set it to entries', () => {
			spyOn(oc, '_createEntry').and.callThrough();

			oc.inject(classConstructor, dependencies);

			expect(oc._entries.get(classConstructor).classConstructor).toEqual(
				classConstructor
			);
			expect(oc._entries.get(classConstructor).dependencies).toEqual(
				dependencies
			);
			expect(oc._createEntry).toHaveBeenCalledWith(
				classConstructor,
				dependencies
			);
			expect(oc._entries.size).toEqual(1);
		});

		it('should set instance of entry from aliases to the entries', () => {
			spyOn(oc, '_createEntry').and.callThrough();

			oc.bind(alias, classConstructor, dependencies);
			oc.inject(classConstructor, dependencies);

			expect(oc._entries.get(classConstructor).classConstructor).toEqual(
				classConstructor
			);
			expect(oc._entries.get(classConstructor).dependencies).toEqual(
				dependencies
			);
			expect(oc._entries.size).toEqual(2);
			expect(oc._createEntry.calls.count()).toEqual(1);
			expect(oc._entries.get(classConstructor)).toEqual(
				oc._entries.get(alias)
			);
		});

		it('should be throw error, if yow call inject more then 2 times for same classConstructor', () => {
			oc.inject(classConstructor, dependencies);
			oc.inject(classConstructor, dependencies);

			expect(() => {
				oc.inject(classConstructor, dependencies);
			}).toThrow();
		});
	});

	describe('bind method', () => {
		beforeEach(() => {
			oc.clear();
		});

		it('should be throw Error if classContructor param is not type of function', () => {
			expect(() => {
				oc.bind(alias, {}, dependencies);
			}).toThrow();
		});

		it('should be throw Error if object container is locked', () => {
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);

			expect(() => {
				oc.bind(alias, classConstructor, dependencies);
			}).toThrow();
		});

		it('should be create new entry for defined dependencies', () => {
			spyOn(oc, '_createEntry').and.callThrough();

			oc.bind(alias, classConstructor, dependencies);

			expect(oc._createEntry).toHaveBeenCalledWith(
				classConstructor,
				dependencies
			);
		});

		it('should be use entry from entries which was defined by inject method', () => {
			oc.inject(classConstructor, dependencies);

			spyOn(oc, '_createEntry').and.callThrough();

			oc.bind(alias, classConstructor);

			expect(oc._createEntry.calls.count()).toEqual(0);
			expect(oc._entries.get(alias)).toEqual(
				oc._entries.get(classConstructor)
			);
		});

		it('should be use entry from entries which was defined by provide method', () => {
			oc.provide(classParent, classConstructor, dependencies);

			spyOn(oc, '_createEntry').and.callThrough();

			oc.bind(alias, classParent);

			expect(oc._createEntry.calls.count()).toEqual(0);
			expect(oc._entries.get(alias)).toEqual(
				oc._entries.get(classParent)
			);
		});

		it('should use entry from entries which was provided and binded', () => {
			oc.provide(classParent, classConstructor, dependencies);
			oc.bind(alias, classParent);
			let aliasEntry = oc._entries.get(alias);

			spyOn(oc, '_updateEntryValues').and.callThrough();

			oc.bind(
				alias,
				classConstructorWithDependencies,
				classConstructorWithDependencies.$dependencies
			);

			expect(oc._updateEntryValues).toHaveBeenCalledWith(
				aliasEntry,
				classConstructorWithDependencies,
				classConstructorWithDependencies.$dependencies
			);
			expect(aliasEntry.classConstructor).toEqual(
				classConstructorWithDependencies
			);
			expect(aliasEntry.dependencies).toEqual(
				classConstructorWithDependencies.$dependencies
			);
		});

		it('should create new entry for unregistered alias with defined dependencies, it is feature for AB tests', () => {
			oc.inject(classConstructor, dependencies);
			oc.bind(alias, classConstructor);

			spyOn(oc, '_createEntry').and.callThrough();

			oc.bind(alias2, classConstructor, []);

			expect(oc._createEntry.calls.count()).toEqual(1);
			expect(oc._entries.get(alias2)).not.toEqual(
				oc._entries.get(classConstructor)
			);
			expect(oc._entries.get(alias2).dependencies).toEqual([]);
		});
	});

	describe('provide method', () => {
		beforeEach(() => {
			oc.clear();
		});

		it('should be throw Error if you call provide method more times for same interfaceConstructor in plugin', () => {
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);
			oc.provide(classParent, classConstructor, dependencies);

			expect(() => {
				oc.provide(classParent, classConstructor, dependencies);
			}).toThrow();
		});

		it('should be throw Error, if interface is not match with implementation', () => {
			expect(() => {
				oc.provide(classDependency, classConstructor, dependencies);
			}).toThrow();
		});

		it('should be create new Entry and set it to entries', () => {
			spyOn(oc, '_createEntry').and.callThrough();

			oc.provide(classParent, classConstructor, dependencies);

			expect(oc._createEntry.calls.count()).toEqual(1);
			expect(oc._entries.size).toEqual(2);
		});
	});

	describe('has method', () => {
		beforeEach(() => {
			oc.clear();
		});

		it('should return true if name is exist in object container', () => {
			oc.inject(classConstructor, dependencies);

			expect(oc.has(classConstructor)).toEqual(true);
			expect(oc.has(namespacePathUnit)).toEqual(true);
		});

		it('should return true if classConstructor has defined $dependencies property', () => {
			expect(oc.has(classConstructorWithDependencies)).toEqual(true);
		});

		it('should return false if name is not exist in object container', () => {
			expect(oc.has(classConstructor)).toEqual(false);
			expect(oc.has(namespacePathOC)).toEqual(false);
		});
	});

	describe('get method', () => {
		let entry;

		beforeEach(() => {
			entry = {
				sharedInstance: null,
				classConstructor: classConstructor,
				dependencies: dependencies
			};
		});

		it('should return shared instance', () => {
			entry.sharedInstance = false;

			spyOn(oc, '_getEntry').and.returnValue(entry);
			spyOn(oc, '_createInstanceFromEntry').and.stub();

			expect(oc.get('entry')).toEqual(entry.sharedInstance);
			expect(oc._createInstanceFromEntry.calls.count()).toEqual(0);
		});

		it('should create new instance', () => {
			spyOn(oc, '_getEntry').and.returnValue(entry);
			spyOn(oc, '_createInstanceFromEntry').and.stub();

			oc.get('entry');

			expect(oc._createInstanceFromEntry).toHaveBeenCalledWith(entry);
		});
	});

	describe('_getEntry method', () => {
		beforeEach(() => {
			oc.clear();
		});

		it('should be throw Error for undefined identification of entry', () => {
			expect(() => {
				oc._getEntry(() => {});
			}).toThrow();

			expect(() => {
				oc._getEntry('undefined');
			}).toThrow();
		});

		it('should be return entry from constants', () => {
			oc.constant(constantName, constantValue);

			expect(oc._getEntry(constantName).sharedInstance).toEqual(
				constantValue
			);
		});

		it('should be return entry from aliases', () => {
			oc.bind(alias, classConstructor, dependencies);

			let entry = oc._getEntry(alias);

			expect(entry.classConstructor).toEqual(classConstructor);
			expect(entry.dependencies).toEqual(dependencies);
		});

		it('should be return value from registry', () => {
			oc.inject(classConstructor, dependencies);

			let entry = oc._getEntry(classConstructor);

			expect(entry.classConstructor).toEqual(classConstructor);
			expect(entry.dependencies).toEqual(dependencies);
		});

		it('should be return value from namespace', () => {
			let value = { a: 1 };
			let namespace = ns.get(namespacePathUnit);
			namespace.ObjectContainer = value;

			let entry = oc._getEntry(namespacePathOC);

			expect(entry.sharedInstance).toEqual(value);
		});

		it('should be return value from registry for class constructor with $dependencies', () => {
			let entry = oc._getEntry(classConstructorWithDependencies);

			expect(entry.classConstructor).toEqual(
				classConstructorWithDependencies
			);
			expect(entry.dependencies).toEqual(
				classConstructorWithDependencies.$dependencies
			);
		});
	});

	describe('_getEntryFromConstant method', () => {
		beforeEach(() => {
			oc.clear();
		});

		it('should return entry by name from stored constants', () => {
			oc.constant(constantObjectName, constantObjectValue);

			let entry = oc._getEntryFromConstant(constantObjectName);

			expect(entry.sharedInstance).toEqual(constantObjectValue);
		});

		it('should return entry by composition name to property from stored constants', () => {
			oc.constant(constantObjectName, constantObjectValue);

			let entry = oc._getEntryFromConstant(constantCompositionName);

			expect(entry.sharedInstance).toEqual(constantObjectProperty);
		});

		it('should return null for bad type of composition name', () => {
			oc.constant(constantObjectName, constantObjectValue);

			let entry = oc._getEntryFromConstant(() => {});

			expect(entry).toEqual(null);
		});
	});

	describe('_getEntryFromNamespace method', () => {
		let namespace = null;
		beforeEach(() => {
			namespace = ns.get(namespacePathUnit);
			namespace.ObjectContainer = classConstructor;

			oc.clear();
		});

		it('should be return entry from registry', () => {
			oc.inject(classConstructor, dependencies);

			let entry = oc._getEntryFromNamespace(namespacePathOC);

			expect(entry.classConstructor).toEqual(classConstructor);
			expect(entry.dependencies).toEqual(dependencies);
		});

		it('should be create new entry if namespace return function with zero dependencies and their dependencies is not injected', () => {
			namespace.ObjectContainer = classDependency;

			spyOn(oc, '_createEntry').and.callThrough();

			let entry = oc._getEntryFromNamespace(namespacePathOC);

			expect(entry.classConstructor).toEqual(classDependency);
			expect(entry.dependencies).toEqual([]);
		});

		it('should be create entry with constant value if namespace return another type than function', () => {
			let constant = { a: 1 };
			namespace.ObjectContainer = constant;

			spyOn(oc, '_createEntry').and.callThrough();

			let entry = oc._getEntryFromNamespace(namespacePathOC);

			expect(entry.sharedInstance).toEqual(constant);
		});
	});

	describe('_getEntryFromClassConstructor method', () => {
		beforeEach(() => {
			oc.clear();
		});

		it('should return null if classConstructor is not a function', () => {
			expect(oc._getEntryFromClassConstructor()).toEqual(null);
		});

		it('should return null for not defined $dependencies property', () => {
			expect(oc._getEntryFromClassConstructor(classConstructor)).toEqual(
				null
			);
		});

		it('should set class to entries if class has defined $dependencies', () => {
			spyOn(oc, '_createEntry').and.callThrough();

			oc._getEntryFromClassConstructor(classConstructorWithDependencies);

			expect(oc._createEntry).toHaveBeenCalledWith(
				classConstructorWithDependencies,
				classConstructorWithDependencies.$dependencies
			);
			expect(oc._entries.size).toEqual(1);
		});

		it('should return entry if class has defined $dependencies', () => {
			let entry = oc._getEntryFromClassConstructor(
				classConstructorWithDependencies
			);

			expect(entry.classConstructor).toEqual(
				classConstructorWithDependencies
			);
			expect(entry.dependencies).toEqual(
				classConstructorWithDependencies.$dependencies
			);
		});
	});
});
