describe('ima.ObjectContainer', function() {

	var ObjectContainer = $import('ima/ObjectContainer');

	var oc = null;

	function classConstructorWithDependencies(dependency) { this.dependecy = dependency };
	classConstructorWithDependencies.$dependencies = [];

	var alias = 'alias';
	var classParent = function mockClassParent() { this.parent = this; };
	var classConstructor = function mockClassConstructor(dependency) { this.dependency = dependency };
	var classDependency = function mockDependency() {};
	var dependencies = [classDependency, classConstructorWithDependencies];
	extend(classConstructor, classParent);

	var constantName = 'constant';
	var constantValue = 'value';
	var constantObjectName = 'constantObject';
	var constantCompositionName = 'constantObject.path.to.property';
	var constantObjectProperty = 'property';
	var constantObjectValue = { path: { to: { property: constantObjectProperty } } };

	var namespacePathUnit = 'test.unit';
	var namespacePathOC = 'test.unit.ObjectContainer';
	ns.namespace(namespacePathUnit);

	beforeEach(function() {
		oc = new ObjectContainer(ns);
	});

	it('should be empty object container', function() {
		expect(oc._entries.size).toEqual(0);
	});

	it('should be clear entries', function() {
		spyOn(oc._entries, 'clear')
			.and
			.stub();

		oc.clear();

		expect(oc._entries.clear).toHaveBeenCalled();
	});

	describe('constant method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should be throw Error, if you want to re-set constant value for simple constant name', function() {
			oc.constant(constantName, constantValue);

			expect(function() {
				oc.constant(constantName, constantValue);
			}).toThrow();
		});

		it('should be throw Error, if you want to re-set constant value for composition name', function() {
			oc.constant(constantObjectName, constantObjectValue);

			expect(function() {
				oc.constant(constantCompositionName, constantObjectProperty);
			}).toThrow();
		});

		it('should be throw Error, if you want to set constatn in plugin', function() {
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);

			expect(function() {
				oc.constant(constantObjectName, constantObjectValue);
			}).toThrow();
		});

		it('should be set constant value', function() {
			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc.constant(constantName, constantValue);

			expect(oc._createEntry).toHaveBeenCalled();
			expect(oc._entries.get(constantName).sharedInstance, constantValue);
		});

	});

	describe('inject method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should throw error, if classConstructor parameter is not function', function() {
			expect(function() {
				oc.inject(alias, dependencies);
			}).toThrow();
		});

		it('should throw error, if classConstructor is registered and object container is locked for plugin', function() {
			oc.inject(classConstructor, dependencies);
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);

			expect(function() {
				oc.inject(classConstructor, dependencies);
			}).toThrow();
		});

		it('should be create new instance of entry and set it to entries', function() {
			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc.inject(classConstructor, dependencies);

			expect(oc._entries.get(classConstructor).classConstructor).toEqual(classConstructor);
			expect(oc._entries.get(classConstructor).dependencies).toEqual(dependencies);
			expect(oc._createEntry).toHaveBeenCalledWith(classConstructor, dependencies);
			expect(oc._entries.size).toEqual(1);
		});

		it('should set instance of entry from aliases to the entries', function() {
			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc.bind(alias, classConstructor, dependencies);
			oc.inject(classConstructor, dependencies);

			expect(oc._entries.get(classConstructor).classConstructor).toEqual(classConstructor);
			expect(oc._entries.get(classConstructor).dependencies).toEqual(dependencies);
			expect(oc._entries.size).toEqual(2);
			expect(oc._createEntry.calls.count()).toEqual(1);
			expect(oc._entries.get(classConstructor)).toEqual(oc._entries.get(alias));
		});

		it('should be throw error, if yow call inject more then 2 times for same classConstructor', function() {
			oc.inject(classConstructor, dependencies);
			oc.inject(classConstructor, dependencies);

			expect(function() {
				oc.inject(classConstructor, dependencies);
			}).toThrow();
		});
	});


	describe('bind method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should be throw Error if classContructor param is not type of function', function() {
			expect(function() {
				oc.bind(alias, {}, dependencies);
			}).toThrow();
		});

		it('should be throw Error if object container is locked', function() {
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);

			expect(function() {
				oc.bind(alias, classConstructor, dependencies);
			}).toThrow();
		});

		it('should be create new entry for defined dependencies', function() {
			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc.bind(alias, classConstructor, dependencies);

			expect(oc._createEntry).toHaveBeenCalledWith(classConstructor, dependencies);
		});

		it('should be use entry from entries which was defined by inject method', function() {
			oc.inject(classConstructor, dependencies);

			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc.bind(alias, classConstructor);

			expect(oc._createEntry.calls.count()).toEqual(0);
			expect(oc._entries.get(alias)).toEqual(oc._entries.get(classConstructor));
		});

		it('should be use entry from entries which was defined by provide method', function() {
			oc.provide(classParent, classConstructor, dependencies);

			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc.bind(alias, classParent);

			expect(oc._createEntry.calls.count()).toEqual(0);
			expect(oc._entries.get(alias)).toEqual(oc._entries.get(classParent));
		});

	});

	describe('provide method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should be throw Error if you call provide method more times for same interfaceConstructor in plugin', function() {
			oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE);
			oc.provide(classParent, classConstructor, dependencies);

			expect(function() {
				oc.provide(classParent, classConstructor, dependencies);
			}).toThrow();
		});

		it('should be throw Error, if interface is not match with implementation', function() {
			expect(function() {
				oc.provide(classDependency, classConstructor, dependencies);
			}).toThrow();
		});

		it('should be create new Entry and set it to entries', function() {
			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc.provide(classParent, classConstructor, dependencies);

			expect(oc._createEntry.calls.count()).toEqual(1);
			expect(oc._entries.size).toEqual(2);
		});
	});

	describe('has method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should return true if name is exist in object container', function() {
			oc.inject(classConstructor, dependencies);

			expect(oc.has(classConstructor)).toEqual(true);
			expect(oc.has(namespacePathUnit)).toEqual(true);
		});

		it('should return true if classConstructor has defined $dependencies property', function() {
			expect(oc.has(classConstructorWithDependencies)).toEqual(true);
		});

		it('should return false if name is not exist in object container', function() {
			expect(oc.has(classConstructor)).toEqual(false);
			expect(oc.has(namespacePathOC)).toEqual(false);
		});

	});

	describe('get method', function() {

		var entry;

		beforeEach(function() {
			entry = {
				sharedInstance: null,
				classConstructor: classConstructor,
				dependencies: dependencies
			};
		});

		it('should return shared instance', function() {
			entry.sharedInstance = false;

			spyOn(oc, '_getEntry')
				.and
				.returnValue(entry);
			spyOn(oc, '_createInstanceFromEntry')
				.and
				.stub();

			expect(oc.get('entry')).toEqual(entry.sharedInstance);
			expect(oc._createInstanceFromEntry.calls.count()).toEqual(0);
		});

		it('should create new instance', function() {
			spyOn(oc, '_getEntry')
				.and
				.returnValue(entry);
			spyOn(oc, '_createInstanceFromEntry')
				.and
				.stub();

			oc.get('entry');

			expect(oc._createInstanceFromEntry).toHaveBeenCalledWith(entry);
		});

	});

	describe('_getEntry method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should be throw Error for undefined identification of entry', function() {
			expect(function() {
				oc._getEntry(function() {});
			}).toThrow();

			expect(function() {
				oc._getEntry('undefined');
			}).toThrow();
		});

		it('should be return entry from constants', function() {
			oc.constant(constantName, constantValue);

			expect(oc._getEntry(constantName).sharedInstance).toEqual(constantValue);
		});

		it('should be return entry from aliases', function() {
			oc.bind(alias, classConstructor, dependencies);

			var entry = oc._getEntry(alias);

			expect(entry.classConstructor).toEqual(classConstructor);
			expect(entry.dependencies).toEqual(dependencies);
		});

		it('should be return value from registry', function() {
			oc.inject(classConstructor, dependencies);

			var entry = oc._getEntry(classConstructor);

			expect(entry.classConstructor).toEqual(classConstructor);
			expect(entry.dependencies).toEqual(dependencies);
		});

		it('should be return value from namespace', function() {
			var value = { a: 1 };
			var namespace = ns.get(namespacePathUnit);
			namespace.ObjectContainer = value;

			var entry = oc._getEntry(namespacePathOC);

			expect(entry.sharedInstance).toEqual(value);
		});

		it('should be return value from registry for class constructor with $dependencies', function() {
			var entry = oc._getEntry(classConstructorWithDependencies);

			expect(entry.classConstructor).toEqual(classConstructorWithDependencies);
			expect(entry.dependencies).toEqual(classConstructorWithDependencies.$dependencies);
		});

	});

	describe('_getEntryFromConstant method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should return entry by name from stored constants', function() {
			oc.constant(constantObjectName, constantObjectValue);

			var entry = oc._getEntryFromConstant(constantObjectName);

			expect(entry.sharedInstance).toEqual(constantObjectValue);
		});

		it('should return entry by composition name to property from stored constants', function() {
			oc.constant(constantObjectName, constantObjectValue);

			var entry = oc._getEntryFromConstant(constantCompositionName);

			expect(entry.sharedInstance).toEqual(constantObjectProperty);
		});

		it('should return null for bad type of composition name', function() {
			oc.constant(constantObjectName, constantObjectValue);

			var entry = oc._getEntryFromConstant(function() {});

			expect(entry).toEqual(null);
		});

	});

	describe('_getEntryFromNamespace method', function() {

		var namespace = null;
		beforeEach(function() {
			namespace = ns.get(namespacePathUnit);
			namespace.ObjectContainer = classConstructor;

			oc.clear();
		});

		it('should be return entry from registry', function() {
			oc.inject(classConstructor, dependencies);

			var entry = oc._getEntryFromNamespace(namespacePathOC);

			expect(entry.classConstructor).toEqual(classConstructor);
			expect(entry.dependencies).toEqual(dependencies);
		});

		it('should be create new entry if namespace return function with zero dependencies and their dependencies is not injected', function() {
			namespace.ObjectContainer = classDependency;

			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			var entry = oc._getEntryFromNamespace(namespacePathOC);

			expect(entry.classConstructor).toEqual(classDependency);
			expect(entry.dependencies).toEqual([]);
		});

		it('should be create entry with constant value if namespace return another type than function', function() {
			var constant = { a: 1 };
			namespace.ObjectContainer = constant;

			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			var entry = oc._getEntryFromNamespace(namespacePathOC);

			expect(entry.sharedInstance).toEqual(constant);
		});

	});

	describe('_getEntryFromClassConstructor method', function() {

		beforeEach(function() {
			oc.clear();
		});

		it('should return null if classConstructor is not a function', function() {
			expect(oc._getEntryFromClassConstructor()).toEqual(null);
		});

		it('should return null for not defined $dependencies property', function() {
			expect(oc._getEntryFromClassConstructor(classConstructor)).toEqual(null);
		});

		it('should set class to entries if class has defined $dependencies', function() {
			spyOn(oc, '_createEntry')
				.and
				.callThrough();

			oc._getEntryFromClassConstructor(classConstructorWithDependencies);

			expect(oc._createEntry).toHaveBeenCalledWith(classConstructorWithDependencies, classConstructorWithDependencies.$dependencies);
			expect(oc._entries.size).toEqual(1);
		});

		it('should return entry if class has defined $dependencies', function() {
			var entry = oc._getEntryFromClassConstructor(classConstructorWithDependencies);

			expect(entry.classConstructor).toEqual(classConstructorWithDependencies);
			expect(entry.dependencies).toEqual(classConstructorWithDependencies.$dependencies);
		});

	});

});
