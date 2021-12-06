import { useFramesStore } from '#/stores/framesStore';
import { mapStackFramesToOriginal } from '#/utils/stackFrameMapper';
import { useEffect } from 'react';
import { ClientEventName, OverlayEventName } from '../../../types';

function useConnectOverlay() {
  const { dispatch } = useFramesStore();
  const { name, message, callStack } = window.__ima_server_error || {};

  // Init SSR Errors
  useEffect(() => {
    dispatch({
      type: 'setError',
      payload: { name, message }
    });

    if (!callStack) {
      return;
    }

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

  // Connect error overlay to client interop
  useEffect(() => {
    const runtimeErrorListener = (
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
    };

    const compileErrorListener = (
      event: WindowEventMap[ClientEventName.CompileErrors]
    ) => {
      console.log(event.detail.error);
    };

    const clearErrorsListener = () => {
      console.log('clearErrorsListener');
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
    window.addEventListener(ClientEventName.ClearErrors, clearErrorsListener);

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
        ClientEventName.ClearErrors,
        clearErrorsListener
      );
    };
  }, []);
}

export { useConnectOverlay };
