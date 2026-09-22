import type { PageRenderer } from '@ima/core';
// The pure entry point keeps importing the integration boot free of RTL's global auto cleanup.
import { act } from '@testing-library/react/pure';

export type PageRendererConstructor = new (...args: unknown[]) => PageRenderer;

interface ClientPageRendererInternals extends PageRenderer {
  _viewContainer?: Element;
  _hydrateViewAdapter(): void;
  _renderViewAdapter(callback?: () => void, props?: unknown): void;
}

/**
 * Wraps the application page renderer in React Testing Library's act boundary.
 * The renderer keeps owning its React root, so releasing it does not clean up
 * unrelated RTL renders.
 */
export function createTestingLibraryClientPageRenderer(
  BasePageRenderer: PageRendererConstructor
): PageRendererConstructor {
  const BaseClientPageRenderer = BasePageRenderer as unknown as new (
    ...args: unknown[]
  ) => ClientPageRendererInternals;

  return class TestingLibraryClientPageRenderer extends BaseClientPageRenderer {
    private _viewContainerTemplate?: HTMLElement;

    override unmount(): void {
      const viewContainer = this._viewContainer as HTMLElement | undefined;
      const viewContainerTemplate = this._viewContainerTemplate;
      this._viewContainerTemplate = undefined;

      act(() => super.unmount());

      // React empties the container, so the markup the application booted with is
      // restored for a following boot in the same document.
      if (viewContainerTemplate && viewContainer?.parentNode) {
        const restoredViewContainer = viewContainerTemplate.cloneNode(
          true
        ) as HTMLElement;

        viewContainer.parentNode.replaceChild(
          restoredViewContainer,
          viewContainer
        );
        this._viewContainer = restoredViewContainer;
      }
    }

    override _hydrateViewAdapter(): void {
      this._renderWithTestingLibrary(() => super._hydrateViewAdapter());
    }

    override _renderViewAdapter(callback?: () => void, props?: unknown): void {
      this._renderWithTestingLibrary(() =>
        super._renderViewAdapter(callback, props)
      );
    }

    private _renderWithTestingLibrary(renderView: () => void): void {
      this._viewContainerTemplate ??= (
        this._viewContainer as HTMLElement
      ).cloneNode(true) as HTMLElement;

      act(renderView);
    }
  } as unknown as PageRendererConstructor;
}
