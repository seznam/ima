import { useFramesStore } from '#/stores/framesStore';
import { mapStackFramesToOriginal, parseError } from '#/utils';
import { useEffect } from 'react';
import { ClientEventName, OverlayEventName } from '../../../types';

function useConnectOverlay() {
  const { dispatch } = useFramesStore();
  const { name, message, stack } = window.__ima_server_error || {};

  // Init SSR Errors
  useEffect(() => {
    dispatch({
      type: 'setError',
      payload: { name, message }
    });

    if (!stack) {
      return;
    }

    const initStackFrames = async () => {
      dispatch({
        type: 'setFrames',
        payload: {
          frames: await mapStackFramesToOriginal(parseError(stack))
        }
      });
    };

    initStackFrames();
  }, []);

  // Connect error overlay to client interop
  useEffect(() => {
    const runtimeErrorListener = async (
      event: WindowEventMap[ClientEventName.RuntimeErrors]
    ) => {
      // Define event listeners
      dispatch({
        type: 'setError',
        payload: {
          name: event.detail.error.name,
          message: event.detail.error.message
        }
      });

      dispatch({
        type: 'setFrames',
        payload: {
          frames: await mapStackFramesToOriginal(parseError(event.detail.error))
        }
      });
    };

    const compileErrorListener = (
      event: WindowEventMap[ClientEventName.CompileErrors]
    ) => {
      console.log('compileErrorListener', event.detail.error);
    };

    const clearRuntimeErrorListener = () => {
      console.log('clearRuntimeErrorListener');
    };

    const clearCompileErrorListener = () => {
      console.log('clearCompileErrorListener');
    };

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

    return () => {
      // Cleanup
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

export { useConnectOverlay };
