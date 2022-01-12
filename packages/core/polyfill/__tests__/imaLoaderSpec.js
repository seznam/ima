describe('imaLoader', () => {
  let imaLoader = null;

  const moduleName = 'moduleName';

  const mockDependencies = ['foo'];
  const mockFactory = () => ({
    setters: [() => {}],
    execute: () => {},
  });

  const mockModule = {
    dependencies: mockDependencies,
    dependencyOf: [],
    factory: mockFactory,
    instance: null,
  };

  const instancedMockModule = {
    dependencies: mockDependencies,
    dependencyOf: [],
    factory: mockFactory,
    instance: {},
  };

  beforeEach(() => {
    jest.resetModules();
    require('../imaLoader');

    imaLoader = $IMA.Loader;
  });

  it('should register modul to imaLoader modules', () => {
    imaLoader.register(moduleName, mockModule.dependencies, mockModule.factory);

    expect(Object.keys(imaLoader.modules)).toHaveLength(1);
    expect(imaLoader.modules[moduleName]).toMatchObject(mockModule);
  });

  it('should register modul to imaLoader modules with existing name', () => {
    const replaceMockModule = {
      dependencies: [],
      dependencyOf: [],
      factory: null,
      instance: null,
    };
    imaLoader.register(moduleName, mockModule.dependencies, mockModule.factory);
    imaLoader.register(
      moduleName,
      replaceMockModule.dependencies,
      replaceMockModule.factory
    );

    expect(Object.keys(imaLoader.modules)).toHaveLength(1);
    expect(imaLoader.modules[moduleName]).toMatchObject(replaceMockModule);
  });

  it('should register two moduls', () => {
    const secondModuleName = 'secondModuleName';

    imaLoader.register(moduleName, mockModule.dependencies, mockModule.factory);
    //rewrite module with same name
    imaLoader.register(moduleName, [], null);
    imaLoader.register(
      secondModuleName,
      mockModule.dependencies,
      mockModule.factory
    );

    expect(Object.keys(imaLoader.modules)).toHaveLength(2);
  });

  it('should replace modul in imaLoader modules', () => {
    imaLoader.register('foo', [], mockFactory);
    imaLoader.register(moduleName, [], null);
    imaLoader.replaceModule(
      moduleName,
      mockModule.dependencies,
      mockModule.factory
    );

    expect(Object.keys(imaLoader.modules)).toHaveLength(2);
    expect(imaLoader.modules[moduleName]).toMatchObject(instancedMockModule);
  });

  it('should throw exception if trying to replace not registered module', () => {
    expect.assertions(1);

    expect(() => {
      imaLoader.replaceModule(
        moduleName,
        mockModule.dependencies,
        mockModule.factory
      );
    }).toThrow('You must register module "moduleName" at first');
  });

  it('should importSync modul', () => {
    imaLoader.register('foo', [], mockFactory);
    imaLoader.register(moduleName, mockModule.dependencies, mockModule.factory);
    imaLoader.importSync(moduleName);

    expect(Object.keys(imaLoader.modules)).toHaveLength(2);
    expect(imaLoader.modules[moduleName]).toMatchObject(instancedMockModule);
  });

  it('should throw exception if trying to importSync not registered module', () => {
    expect.assertions(1);

    expect(() => {
      imaLoader.importSync(moduleName);
    }).toThrow(
      `$IMA.Loader.importSync: Module name ${moduleName} is not registered. Update your build.js.`
    );
  });

  it('should initAllModules successfully for empty list', async () => {
    expect.assertions(0);

    await imaLoader.initAllModules();
  });

  it('should initAllModules', async () => {
    imaLoader.register('foo', [], mockFactory);
    imaLoader.register(moduleName, mockModule.dependencies, mockModule.factory);
    expect.assertions(0);

    await imaLoader.initAllModules();
  });

  it('should catch errors in initAllModules', async () => {
    imaLoader.register(moduleName, [], () => {});

    expect.assertions(1);

    await imaLoader
      .initAllModules()
      .catch(e =>
        expect(e.message).toMatch(
          `The module ${moduleName} throw error during initialization. Cannot read property 'execute' of undefined`
        )
      );
  });
});
