import { AbstractExtension } from '../..';
import { AbstractController } from '../../controller/AbstractController';
import { Extension } from '../../extension/Extension';
import { ns } from '../../Namespace';
import { Dependencies, ObjectContainer } from '../../oc/ObjectContainer';
import { RouteOptions } from '../../router/Router';
import { PageFactory } from '../PageFactory';

describe('ima.core.PageFactory', () => {
  let oc: ObjectContainer;
  let pageFactory: PageFactory;
  let routeOptions: RouteOptions;

  const namespacePathUnit = 'test.unit';
  ns.namespace(namespacePathUnit);

  class MockExtension extends AbstractExtension {
    dependency: unknown;

    static get $dependencies() {
      return [];
    }

    constructor(dependency: unknown) {
      super();

      this.dependency = dependency;
    }
  }

  class MockExtension2 extends MockExtension {}

  class ClassConstructor extends AbstractController {
    dependency: unknown;

    static get $dependencies() {
      return [];
    }

    constructor(dependency: unknown) {
      super();

      this.dependency = dependency;
    }
  }

  class ClassConstructorWithExtensions extends AbstractController {
    dependency: unknown;

    static get $dependencies() {
      return [];
    }

    static $extensions?: Dependencies<Extension> = [MockExtension];

    constructor(dependency: unknown) {
      super();

      this.dependency = dependency;
    }
  }

  beforeEach(() => {
    oc = new ObjectContainer(ns);
    pageFactory = new PageFactory(oc);
    routeOptions = {
      autoScroll: true,
      documentView: null,
      managedRootView: null,
      onlyUpdate: false,
      viewAdapter: null,
      middlewares: [],
    };
  });

  describe('createController method', () => {
    it('should create controller with extension', () => {
      const controller = pageFactory.createController(
        ClassConstructorWithExtensions,
        routeOptions
      );

      expect(controller.getExtensions()).toHaveLength(1);
      expect(controller.getExtension(MockExtension)).toBeInstanceOf(
        MockExtension
      );
    });

    it('should create controller with extension in routes', () => {
      const controller = pageFactory.createController(ClassConstructor, {
        ...routeOptions,
        extensions: [MockExtension2],
      });

      expect(controller.getExtensions()).toHaveLength(1);
      expect(controller.getExtension(MockExtension2)).toBeInstanceOf(
        MockExtension2
      );
    });

    it('should create controller with own extension and extension in route', () => {
      const controller = pageFactory.createController(
        ClassConstructorWithExtensions,
        {
          ...routeOptions,
          extensions: [MockExtension2],
        }
      );

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(MockExtension2);
      expect(controller.getExtensions()[1]).toBeInstanceOf(MockExtension);
      expect(controller.getExtension(MockExtension)).toBeInstanceOf(
        MockExtension
      );
      expect(controller.getExtension(MockExtension2)).toBeInstanceOf(
        MockExtension2
      );
    });

    it('should create controller with OC constant spread extensions', () => {
      oc.constant('$mockedExtensions', [MockExtension, MockExtension2]);

      ClassConstructorWithExtensions.$extensions = ['...$mockedExtensions'];
      const controller = pageFactory.createController(
        ClassConstructorWithExtensions,
        routeOptions
      );

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBe(
        (oc.get('...$mockedExtensions') as [0])[0]
      );
      expect(controller.getExtensions()[0]).toBeInstanceOf(MockExtension);
      ClassConstructorWithExtensions.$extensions = [];
    });

    it('should create controller with OC constant extensions in router', () => {
      oc.constant('$mockedExtensions', [MockExtension, MockExtension2]);

      const controller = pageFactory.createController(ClassConstructor, {
        ...routeOptions,
        extensions: ['...$mockedExtensions'],
      });

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBe(
        (oc.get('...$mockedExtensions') as [0])[0]
      );
      expect(controller.getExtensions()[0]).toBeInstanceOf(MockExtension);
    });

    it('should create controller with array of extensions', () => {
      const extensions = [MockExtension, MockExtension2];

      ClassConstructorWithExtensions.$extensions = extensions;
      const controller = pageFactory.createController(
        ClassConstructorWithExtensions,
        routeOptions
      );

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(extensions[0]);
      expect(controller.getExtensions()[1]).toBeInstanceOf(extensions[1]);
      ClassConstructorWithExtensions.$extensions = [];
    });

    it('should create controller with array of extensions in route', () => {
      const extensions = [MockExtension, MockExtension2];

      const controller = pageFactory.createController(ClassConstructor, {
        ...routeOptions,
        extensions,
      });

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(extensions[0]);
      expect(controller.getExtensions()[1]).toBeInstanceOf(extensions[1]);
    });

    it('should throw when spread not used in OC constant', () => {
      oc.constant('$mockedExtensions', [MockExtension, MockExtension2]);

      ClassConstructorWithExtensions.$extensions = ['$mockedExtensions'];
      expect(() =>
        pageFactory.createController(
          ClassConstructorWithExtensions,
          routeOptions
        )
      ).toThrow(
        'ima.core.AbstractController:addExtension: Expected instance of an extension, got function.'
      );
      ClassConstructorWithExtensions.$extensions = [];
    });
  });
});
