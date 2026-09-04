import { Namespace, ObjectContainer, PageRenderer } from '@ima/core';
import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';

import { initBindApp } from '../integration/bind';

describe('integration bind', () => {
  function createObjectContainer(dependencies: unknown[] = []) {
    const namespace = new Namespace();
    const oc = new ObjectContainer(namespace);

    oc.provide(PageRenderer, ClientPageRenderer, dependencies);
    oc.bind('$PageRenderer', PageRenderer);

    return { namespace, oc };
  }

  it('rebinds the page renderer alias to the Testing Library implementation', () => {
    const { namespace, oc } = createObjectContainer();

    initBindApp(namespace, oc);

    expect(oc.getConstructorOf('$PageRenderer')).toBe(
      oc.getConstructorOf(PageRenderer as unknown as typeof ClientPageRenderer)
    );
    expect(oc.getConstructorOf('$PageRenderer')).not.toBe(ClientPageRenderer);
  });

  it('keeps the dependencies configured by the application', () => {
    const dependencies = ['$Helper', '$Dispatcher', '$Settings'];
    const { namespace, oc } = createObjectContainer(dependencies);

    initBindApp(namespace, oc);

    expect(oc._getEntry('$PageRenderer')?.dependencies).toEqual(dependencies);
  });

  it('throws when the application binds no page renderer', () => {
    const namespace = new Namespace();
    const oc = new ObjectContainer(namespace);

    expect(() => initBindApp(namespace, oc)).toThrow();
  });
});
