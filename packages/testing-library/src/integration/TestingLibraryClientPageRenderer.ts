import type { PageRenderer } from '@ima/core';
// The pure entry point keeps importing the integration boot free of RTL's global auto cleanup.
import { render, type RenderResult } from '@testing-library/react/pure';
import type { ReactElement } from 'react';

export type PageRendererConstructor = new (...args: unknown[]) => PageRenderer;

interface RenderEntry {
  owner: ClientPageRendererInternals;
  renderResult: RenderResult;
  viewContainerTemplate: HTMLElement;
}

const renderEntries = new WeakMap<HTMLElement, RenderEntry>();

interface ClientPageRendererInternals extends PageRenderer {
  _viewContainer?: Element;
  _getViewAdapterElement(props?: unknown): ReactElement | undefined;
  _getHydrateCallback(): () => void;
  _runUnmountCallback(): void;
  _hydrateViewAdapter(): void;
  _renderViewAdapter(callback?: () => void, props?: unknown): void;
}

/**
 * Wraps the application page renderer so React Testing Library owns its React root.
 * The pure entry point leaves cleanup under the integration application's control.
 */
export function createTestingLibraryClientPageRenderer(
  BasePageRenderer: PageRendererConstructor
): PageRendererConstructor {
  const BaseClientPageRenderer = BasePageRenderer as unknown as new (
    ...args: unknown[]
  ) => ClientPageRendererInternals;

  return class TestingLibraryClientPageRenderer extends BaseClientPageRenderer {
    private _testingLibraryRenderResult?: RenderResult;
    private _viewContainerTemplate?: HTMLElement;

    override unmount(): void {
      if (this._testingLibraryRenderResult) {
        const viewContainer = this._viewContainer as HTMLElement;
        const renderEntry = renderEntries.get(viewContainer);

        if (renderEntry?.owner === this) {
          renderEntries.delete(viewContainer);
          this._testingLibraryRenderResult.unmount();

          if (viewContainer.parentNode && this._viewContainerTemplate) {
            const restoredViewContainer = this._viewContainerTemplate.cloneNode(
              true
            ) as HTMLElement;

            viewContainer.parentNode.replaceChild(
              restoredViewContainer,
              viewContainer
            );
            this._viewContainer = restoredViewContainer;
          }

          this._runUnmountCallback();
        }

        this._testingLibraryRenderResult = undefined;
      }

      super.unmount();
    }

    override _hydrateViewAdapter(): void {
      this._renderWithTestingLibrary(
        this._getViewAdapterElement({
          refCallback: this._getHydrateCallback(),
        }) as ReactElement,
        true
      );
    }

    override _renderViewAdapter(callback?: () => void, props?: unknown): void {
      const viewAdapter = this._getViewAdapterElement(
        Object.assign({}, props, { refCallback: callback })
      ) as ReactElement;

      this._renderWithTestingLibrary(viewAdapter);
    }

    private _renderWithTestingLibrary(
      viewAdapter: ReactElement,
      hydrate = false
    ): void {
      const container = this._viewContainer as HTMLElement;
      const existingEntry = renderEntries.get(container);

      if (existingEntry) {
        existingEntry.renderResult.rerender(viewAdapter);
        existingEntry.owner = this;
        this._testingLibraryRenderResult = existingEntry.renderResult;
        this._viewContainerTemplate = existingEntry.viewContainerTemplate;
      } else {
        const viewContainerTemplate = container.cloneNode(true) as HTMLElement;
        const renderResult = render(viewAdapter, {
          container,
          hydrate,
        });

        this._testingLibraryRenderResult = renderResult;
        this._viewContainerTemplate = viewContainerTemplate;
        renderEntries.set(container, {
          owner: this,
          renderResult,
          viewContainerTemplate,
        });
      }
    }
  } as unknown as PageRendererConstructor;
}
