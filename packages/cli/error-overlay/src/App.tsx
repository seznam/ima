import 'tailwindcss/tailwind.css';
import { Fragment, FunctionComponent, useEffect } from 'react';
import { Button, ChevronIcon, Frame, Header } from '#/components';
import { mapStackFramesToOriginal } from '#/utils';
import { useFramesStore } from './stores/framesStore';

/**
 * TODO
 *  - Create bundle with source-map wasm included
 *  - Save viewCompiled toggle to cookies
 *  - make context lines editable
 *  - support for build errors
 *  - performance optimizations
 */
const App: FunctionComponent = () => {
  const { state, dispatch } = useFramesStore();
  const { name, message, callStack } = window.__ima_server_error;

  useEffect(() => {
    const initStackFrames = async () => {
      dispatch({
        type: 'setFrames',
        payload: {
          frames: await mapStackFramesToOriginal(callStack)
        }
      });
    };

    initStackFrames();
  }, []);

  return (
    <div className="container p-4 mx-auto">
      <Header name={name} message={message} />
      {state.frames?.map(({ frame, isVisible, showOriginal }, i) => (
        <Fragment key={frame.id}>
          <Frame
            frame={frame}
            isVisible={isVisible}
            showOriginal={showOriginal}
          />
          {i === 1 && state.collapsedFramesCount !== 0 && (
            <div
              className="flex justify-center items-center mt-8 mb-6">
              <Button bordered onClick={() => dispatch({ type: 'showFrames' })}>
                <ChevronIcon className="mr-1 w-4 h-4" />
                <span>
                  Show {state.collapsedFramesCount} collapsed frames
                </span>
              </Button>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export { App };
