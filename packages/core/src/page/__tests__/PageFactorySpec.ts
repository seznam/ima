import PageFactory from '../PageFactory';
import ObjectContainer from '../../ObjectContainer';
import ns from '../../Namespace';
import AbstractController from '../../controller/AbstractController';
import Extension, { IExtension } from '../../extension/Extension';
import PageStateManager from '../state/PageStateManager';
import {
  StringParameters,
  UnknownParameters,
  UnknownPromiseParameters,
} from '../../CommonTypes';

describe('ima.core.PageFactory', () => {
  let oc: ObjectContainer;
  let pageFactory: PageFactory;

  const namespacePathUnit = 'test.unit';
  ns.namespace(namespacePathUnit);

  class mockExtension extends Extension {
    dependency: unknown;

    static get $dependencies() {
      return [];
    }

    constructor(dependency: unknown) {
      super();

      this.dependency = dependency;
    }

    init(): void | Promise<undefined> {
      throw new Error('Method not implemented.');
    }
    destroy(): void | Promise<undefined> {
      throw new Error('Method not implemented.');
    }
    activate(): void | Promise<undefined> {
      throw new Error('Method not implemented.');
    }
    deactivate(): void | Promise<undefined> {
      throw new Error('Method not implemented.');
    }
    load(): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
      throw new Error('Method not implemented.');
    }
    update(
      prevParams: UnknownParameters
    ): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
      throw new Error('Method not implemented.');
    }
    setState(statePatch: UnknownParameters): void {
      throw new Error('Method not implemented.');
    }
    getState(): UnknownParameters {
      throw new Error('Method not implemented.');
    }
    beginStateTransaction(): void {
      throw new Error('Method not implemented.');
    }
    commitStateTransaction(): void {
      throw new Error('Method not implemented.');
    }
    cancelStateTransaction(): void {
      throw new Error('Method not implemented.');
    }
    setPartialState(partialStatePatch: UnknownParameters): void {
      throw new Error('Method not implemented.');
    }
    getPartialState(): UnknownParameters {
      throw new Error('Method not implemented.');
    }
    clearPartialState(): void {
      throw new Error('Method not implemented.');
    }
    setPageStateManager(pageStateManager: PageStateManager): void {
      throw new Error('Method not implemented.');
    }
    switchToStateManager(): void {
      throw new Error('Method not implemented.');
    }
    switchToPartialState(): void {
      throw new Error('Method not implemented.');
    }
    setRouteParams(params: UnknownParameters): void {
      throw new Error('Method not implemented.');
    }
    getRouteParams(): UnknownParameters {
      throw new Error('Method not implemented.');
    }
    getAllowedStateKeys(): string[] {
      throw new Error('Method not implemented.');
    }
  }

  class mockExtension2 extends mockExtension {}

  class classConstructor extends AbstractController {
    dependency: unknown;

    static get $dependencies() {
      return [];
    }

    constructor(dependency: unknown) {
      super();

      this.dependency = dependency;
    }

    init(): void {
      throw new Error('Method not implemented.');
    }
    destroy(): void {
      throw new Error('Method not implemented.');
    }
    activate(): void {
      throw new Error('Method not implemented.');
    }
    deactivate(): void {
      throw new Error('Method not implemented.');
    }
    load(): UnknownPromiseParameters | Promise<UnknownPromiseParameters> {
      throw new Error('Method not implemented.');
    }
    setMetaParams(): void {
      throw new Error('Method not implemented.');
    }
  }

  class classConstructorWithExtensions extends AbstractController {
    dependency: unknown;

    static get $dependencies() {
      return [];
    }

    static extensionsTest: IExtension[] = [mockExtension];

    static get $extensions() {
      return classConstructorWithExtensions.extensionsTest;
    }

    constructor(dependency: unknown) {
      super();

      this.dependency = dependency;
    }

    init(): void {
      throw new Error('Method not implemented.');
    }
    destroy(): void {
      throw new Error('Method not implemented.');
    }
    activate(): void {
      throw new Error('Method not implemented.');
    }
    deactivate(): void {
      throw new Error('Method not implemented.');
    }
    load(): UnknownPromiseParameters | Promise<UnknownPromiseParameters> {
      throw new Error('Method not implemented.');
    }
    setMetaParams(): void {
      throw new Error('Method not implemented.');
    }
  }

  beforeEach(() => {
    oc = new ObjectContainer(ns);
    pageFactory = new PageFactory(oc);
  });

  describe('createController method', () => {
    it('should create controller with extension', () => {
      const controller = pageFactory.createController(
        classConstructorWithExtensions
      );

      expect(controller.getExtensions()).toHaveLength(1);
      expect(controller.getExtension(mockExtension)).toBeInstanceOf(
        mockExtension
      );
    });

    it('should create controller with extension in routes', () => {
      const controller = pageFactory.createController(classConstructor, {
        extensions: [mockExtension2],
      });

      expect(controller.getExtensions()).toHaveLength(1);
      expect(controller.getExtension(mockExtension2)).toBeInstanceOf(
        mockExtension2
      );
    });

    it('should create controller with own extension and extension in route', () => {
      const controller = pageFactory.createController(
        classConstructorWithExtensions,
        { extensions: [mockExtension2] }
      );

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(mockExtension2);
      expect(controller.getExtensions()[1]).toBeInstanceOf(mockExtension);
      expect(controller.getExtension(mockExtension)).toBeInstanceOf(
        mockExtension
      );
      expect(controller.getExtension(mockExtension2)).toBeInstanceOf(
        mockExtension2
      );
    });

    it('should create controller with OC constant spread extensions', () => {
      oc.constant('$mockedExtensions', [mockExtension, mockExtension2]);

      classConstructorWithExtensions.extensionsTest = ['...$mockedExtensions'];
      const controller = pageFactory.createController(
        classConstructorWithExtensions
      );

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBe(
        (oc.get('...$mockedExtensions') as [0])[0]
      );
      expect(controller.getExtensions()[0]).toBeInstanceOf(mockExtension);
      classConstructorWithExtensions.extensionsTest = [];
    });

    it('should create controller with OC constant extensions in router', () => {
      oc.constant('$mockedExtensions', [mockExtension, mockExtension2]);

      const controller = pageFactory.createController(classConstructor, {
        extensions: ['...$mockedExtensions'],
      });

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBe(
        (oc.get('...$mockedExtensions') as [0])[0]
      );
      expect(controller.getExtensions()[0]).toBeInstanceOf(mockExtension);
    });

    it('should create controller with array of extensions', () => {
      const extensions = [mockExtension, mockExtension2];

      classConstructorWithExtensions.extensionsTest = extensions;
      const controller = pageFactory.createController(
        classConstructorWithExtensions
      );

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(extensions[0]);
      expect(controller.getExtensions()[1]).toBeInstanceOf(extensions[1]);
      classConstructorWithExtensions.extensionsTest = [];
    });

    it('should create controller with array of extensions in route', () => {
      const extensions = [mockExtension, mockExtension2];

      const controller = pageFactory.createController(classConstructor, {
        extensions,
      });

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(extensions[0]);
      expect(controller.getExtensions()[1]).toBeInstanceOf(extensions[1]);
    });

    it('should throw when spread not used in OC constant', () => {
      oc.constant('$mockedExtensions', [mockExtension, mockExtension2]);

      classConstructorWithExtensions.extensionsTest = ['$mockedExtensions'];
      expect(() =>
        pageFactory.createController(classConstructorWithExtensions)
      ).toThrow(
        'ima.core.AbstractController:addExtension: Expected instance of an extension, got function.'
      );
      classConstructorWithExtensions.extensionsTest = [];
    });
  });
});
