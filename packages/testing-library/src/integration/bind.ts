import { PageRenderer } from '@ima/core';
import type { Namespace, ObjectContainer } from '@ima/core';

import {
  createTestingLibraryClientPageRenderer,
  type PageRendererConstructor,
} from './TestingLibraryClientPageRenderer';

/**
 * Replaces the page renderer configured by the application with a subclass that
 * renders through React Testing Library.
 */
export function initBindApp(ns: Namespace, oc: ObjectContainer): void {
  // The dependencies are read from the existing entry so that applications binding a
  // custom page renderer keep their own constructor signature.
  const pageRendererEntry = oc._getEntry('$PageRenderer');
  const ConfiguredPageRenderer = pageRendererEntry?.classConstructor;

  if (!ConfiguredPageRenderer) {
    throw new Error(
      'Cannot find the configured IMA $PageRenderer. Make sure the application ' +
        'binds it before the integration initBindApp runs.'
    );
  }

  const TestingLibraryClientPageRenderer =
    createTestingLibraryClientPageRenderer(
      ConfiguredPageRenderer as unknown as PageRendererConstructor
    );

  oc.provide(
    PageRenderer,
    TestingLibraryClientPageRenderer,
    pageRendererEntry.dependencies
  );
  oc.bind('$PageRenderer', PageRenderer);
}
