import 'tailwindcss/tailwind.css';
import { Fragment, FunctionComponent, useMemo, useState } from 'react';

import { Frame, Header, Hero, Icon, Button } from '#/components';
import { useConnectOverlay } from '#/hooks';
import { useErrorsStore } from '#/stores';

/**
 * TODO
 *  - Save viewCompiled toggle to cookies
 *  - make context lines editable
 *  - support for build errors
 *  - source map parsing performance optimization "with"
 */
const App: FunctionComponent = () => {
  useConnectOverlay();
  const showOriginal = useErrorsStore(c => c.state.showOriginal);
  const currentError = useErrorsStore(c =>
    c.state.currentErrorId ? c.state.errors[c.state.currentErrorId] : null
  );

  const [areCollapsed, setCollapsed] = useState(true);
  const visibleFrames = useMemo(() => {
    if (!currentError) {
      return [];
    }

    if (!areCollapsed) {
      return Object.values(currentError.frames);
    }

    return Object.values(currentError.frames).filter(
      (frameWrapper, index) =>
        index === 0 || !frameWrapper.frame.isCollapsible()
    );
  }, [areCollapsed, currentError]);

  const collapsedFramesCount = useMemo(
    () =>
      currentError?.frames && visibleFrames
        ? Object.keys(currentError.frames).length - visibleFrames.length
        : 0,
    [currentError, visibleFrames]
  );

  if (!currentError) {
    return null;
  }

  return (
    <div className="min-w-full min-h-screen font-mono bg-white text-slate-900">
      <div className="container p-4 mx-auto">
        <Header />
        <Hero error={currentError} showOriginal={showOriginal} />
        {visibleFrames.map((frameWrapper, index) => (
          <Fragment key={frameWrapper.id}>
            <Frame frameWrapper={frameWrapper} errorId={currentError?.id} />
            {index === 0 && collapsedFramesCount > 1 && (
              <div className="flex justify-center items-center mt-8 mb-8">
                <Button
                  className="inline-flex items-center"
                  onClick={() => setCollapsed(false)}>
                  <Icon icon="chevron" size="sm" className="mr-1" />
                  <span>
                    Show{' '}
                    <span className="underline">{collapsedFramesCount}</span>{' '}
                    collapsed frames
                  </span>
                </Button>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export { App };
