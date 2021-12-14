import { useCallback, useEffect } from 'react';

import { useErrorsDispatcher } from '#/stores';
import { mapStackFramesToOriginal, parseError } from '#/utils';

import { ClientEventName, OverlayEventName } from '../../../types';

function useConnectSSRErrorOverlay(): void {
  const dispatch = useErrorsDispatcher();
  const { name, message, stack } = window.__ima_server_error || {};

  useEffect(() => {
    if (!stack) {
      return;
    }

    const initStackFrames = async () => {
      dispatch({
        type: 'addError',
        payload: {
          name,
          message,
          type: 'compiler',
          frames: await mapStackFramesToOriginal(parseError(stack))
        }
      });
    };

    initStackFrames();
  }, []);
}

function useConnectClientErrorOverlay(): void {
  const dispatch = useErrorsDispatcher();

  const runtimeErrorListener = useCallback(
    (event: WindowEventMap[ClientEventName.RuntimeErrors]) => {
      mapStackFramesToOriginal(parseError(event.detail.error)).then(frames => {
        dispatch({
          type: 'addError',
          payload: {
            name: event.detail.error.name,
            message: event.detail.error.message,
            type: 'runtime',
            frames
          }
        });
      });
    },
    []
  );

  const compileErrorListener = useCallback(
    (event: WindowEventMap[ClientEventName.CompileErrors]) => {
      // eslint-disable-next-line no-console
      console.log('compileErrorListener', event.detail.error);
    },
    []
  );

  const clearRuntimeErrorListener = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('clearRuntimeErrorListener');
  }, []);

  const clearCompileErrorListener = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('clearCompileErrorListener');
  }, []);

  // Connect error overlay to client interop
  useEffect(() => {
    // Register listeners to custom events
    window.addEventListener(
      ClientEventName.RuntimeErrors,
      runtimeErrorListener
    );
    window.addEventListener(
      ClientEventName.CompileErrors,
      compileErrorListener
    );
    window.addEventListener(
      ClientEventName.ClearRuntimeErrors,
      clearRuntimeErrorListener
    );
    window.addEventListener(
      ClientEventName.ClearCompileErrors,
      clearCompileErrorListener
    );

    // Dispatch ready event
    window.parent.dispatchEvent(new CustomEvent(OverlayEventName.Ready));

    // Cleanup
    return () => {
      window.removeEventListener(
        ClientEventName.RuntimeErrors,
        runtimeErrorListener
      );
      window.removeEventListener(
        ClientEventName.CompileErrors,
        compileErrorListener
      );
      window.removeEventListener(
        ClientEventName.ClearRuntimeErrors,
        clearRuntimeErrorListener
      );
      window.removeEventListener(
        ClientEventName.ClearCompileErrors,
        clearCompileErrorListener
      );
    };
  }, []);
}

/**
 * Connects overlay to SSR and client-side error handlers.
 */
function useConnectOverlay(): void {
  useConnectSSRErrorOverlay();
  useConnectClientErrorOverlay();
}

export { useConnectOverlay };
