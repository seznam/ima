import PageFactory from '../PageFactory';
import ObjectContainer from '../../ObjectContainer';
import ns from '../../namespace';
import AbstractController from '../../controller/AbstractController';

describe('ima.core.PageFactory', () => {
  let oc = null;
  let pageFactory = null;

  let namespacePathUnit = 'test.unit';
  ns.namespace(namespacePathUnit);

  function classConstructor(dependency) {
    this.dependency = dependency;
  }
  function classConstructorWithExtensions(dependency) {
    this.dependency = dependency;
  }
  let mockExtension = function mockExtensionConstructor(dependency) {
    this.dependency = dependency;
  };
  let mockExtension2 = function mockExtension2Constructor(dependency) {
    this.dependency = dependency;
  };
  mockExtension.$dependencies = [];
  mockExtension2.$dependencies = [];
  classConstructorWithExtensions.$dependencies = [];
  classConstructor.$dependencies = [];

  classConstructorWithExtensions.$extensions = [mockExtension];

  beforeEach(() => {
    oc = new ObjectContainer(ns);
    pageFactory = new PageFactory(oc);
    extend(classConstructorWithExtensions, AbstractController);
    extend(classConstructor, AbstractController);
  });

  describe('createController method', () => {
    it('should create controller with extension', () => {
      let controller = pageFactory.createController(
        classConstructorWithExtensions
      );

      expect(controller.getExtensions()).toHaveLength(1);
      expect(controller.getExtension(mockExtension)).toBeInstanceOf(
        mockExtension
      );
    });

    it('should create controller with extension in routes', () => {
      let controller = pageFactory.createController(classConstructor, {
        extensions: [mockExtension2],
      });

      expect(controller.getExtensions()).toHaveLength(1);
      expect(controller.getExtension(mockExtension2)).toBeInstanceOf(
        mockExtension2
      );
    });

    it('should create controller with own extension and extension in route', () => {
      let controller = pageFactory.createController(
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

      classConstructor.$extensions = ['...$mockedExtensions'];
      let controller = pageFactory.createController(classConstructor);

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBe(
        oc.get('...$mockedExtensions')[0]
      );
      expect(controller.getExtensions()[0]).toBeInstanceOf(mockExtension);
      classConstructor.$extensions = [];
    });

    it('should create controller with OC constant extensions in router', () => {
      oc.constant('$mockedExtensions', [mockExtension, mockExtension2]);

      let controller = pageFactory.createController(classConstructor, {
        extensions: ['...$mockedExtensions'],
      });

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBe(
        oc.get('...$mockedExtensions')[0]
      );
      expect(controller.getExtensions()[0]).toBeInstanceOf(mockExtension);
    });

    it('should create controller with array of extensions', () => {
      let extensions = [mockExtension, mockExtension2];

      classConstructor.$extensions = extensions;
      let controller = pageFactory.createController(classConstructor);

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(extensions[0]);
      expect(controller.getExtensions()[1]).toBeInstanceOf(extensions[1]);
      classConstructor.$extensions = [];
    });

    it('should create controller with array of extensions in route', () => {
      let extensions = [mockExtension, mockExtension2];

      let controller = pageFactory.createController(classConstructor, {
        extensions,
      });

      expect(controller.getExtensions()).toHaveLength(2);
      expect(controller.getExtensions()[0]).toBeInstanceOf(extensions[0]);
      expect(controller.getExtensions()[1]).toBeInstanceOf(extensions[1]);
    });

    it('should throw when spread not used in OC constant', () => {
      oc.constant('$mockedExtensions', [mockExtension, mockExtension2]);

      classConstructor.$extensions = ['$mockedExtensions'];
      expect(() => pageFactory.createController(classConstructor)).toThrow(
        'ima.core.AbstractController:addExtension: Expected instance of an extension, got function.'
      );
      classConstructor.$extensions = [];
    });
  });
});
