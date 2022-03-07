import 'tailwindcss/tailwind.css';

import clsx from 'clsx';
import { Fragment, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { SourceMapConsumer } from 'source-map';

import { Frame, Header, Hero, Icon, Button } from '#/components';
import { useConnectOverlay, useBridgeInterface } from '#/hooks';
import { useErrorsStore } from '#/stores';
import { getDevServerBaseUrl } from '#/utils';

// Needed to enable source map parsing
// @ts-expect-error: Not available in typings
SourceMapConsumer.initialize({
  'lib/mappings.wasm': `${getDevServerBaseUrl()}/__error-overlay-static/mappings.wasm`,
});

const App: FunctionComponent = () => {
  useConnectOverlay();
  const { isSSRError } = useBridgeInterface();
  const { dispatch, currentError } = useErrorsStore();

  const visibleFrames = useMemo(() => {
    if (!currentError) {
      return [];
    }

    if (!currentError.isCollapsed) {
      return Object.values(currentError.frames);
    }

    return [Object.values(currentError.frames)[0]];
  }, [currentError]);

  if (!currentError) {
    return null;
  }

  const collapseFramesCount = Object.keys(currentError.frames).length - 1;

  return (
    <div
      className={clsx(
        'min-w-full min-h-screen font-mono text-slate-900 bg-white origin-top',
        {
          'animate-fade-in-down': !isSSRError,
        }
      )}
    >
      <div className='p-4 mx-auto max-w-screen-lg'>
        <Header error={currentError} />
        <Hero error={currentError} />
        {visibleFrames.filter(Boolean).map((frameWrapper, index) => (
          <Fragment key={frameWrapper.id}>
            <Frame
              frameWrapper={frameWrapper}
              errorId={currentError?.id}
              className={clsx({
                'origin-top animate-fade-in-down': index > 0,
              })}
            />
            {index === 0 && collapseFramesCount > 0 && (
              <div className='flex justify-center items-center my-6 md:my-8'>
                <Button
                  className='inline-flex items-center'
                  onClick={() =>
                    dispatch({
                      type: currentError.isCollapsed ? 'expand' : 'collapse',
                      payload: {
                        errorId: currentError.id,
                      },
                    })
                  }
                >
                  <Icon
                    icon='chevron'
                    size='sm'
                    className={clsx('mr-2 transition-transform', {
                      'rotate-90': !currentError.isCollapsed,
                    })}
                  />
                  <span>
                    Toggle{' '}
                    <span className='underline'>{collapseFramesCount}</span>{' '}
                    hidden frames
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
