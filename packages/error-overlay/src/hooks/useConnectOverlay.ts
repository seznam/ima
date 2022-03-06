import { parseCompileError } from '@ima/dev-utils/dist/compileErrorParser';
import { parseRuntimeError } from '@ima/dev-utils/dist/runtimeErrorParser';
import { useCallback, useEffect } from 'preact/hooks';

import { useErrorsStore } from '#/stores';
import { ClientEventName, OverlayEventName } from '#/types';
import { mapCompileStackFrame, mapStackFramesToOriginal } from '#/utils';

/**
 * SSR rendered runtime errors handler.
 */
function useConnectSSRErrorOverlay(): void {
  const { dispatch } = useErrorsStore();

  useEffect(() => {
    if (!window.__ima_server_error) {
      return;
    }

    const initStackFrames = async () => {
      const { name, message, parsedStack } = parseRuntimeError(
        window.__ima_server_error
      );

      dispatch({
        type: 'add',
        payload: {
          name,
          message,
          type: 'runtime',
          frames: await mapStackFramesToOriginal(parsedStack),
        },
      });
    };

    initStackFrames();
  }, []);
}

/**
 * Client side error handler (connects to HMR-client window events).
 */
function useConnectClientErrorOverlay(): void {
  const { dispatch } = useErrorsStore();
  let isRuntimeCompileError = false; // If set to true we do site reload after errors are fixed

  const runtimeErrorListener = useCallback(
    (event: WindowEventMap[ClientEventName.RuntimeErrors]) => {
      const { name, message, parsedStack } = parseRuntimeError(
        event.detail.error
      );

      // Generate original code fragments
      mapStackFramesToOriginal(parsedStack).then(frames => {
        dispatch({
          type: 'add',
          payload: {
            name: name,
            message: message,
            type: 'runtime',
            frames,
          },
        });
      });
    },
    []
  );

  const compileErrorListener = useCallback(
    (event: WindowEventMap[ClientEventName.CompileErrors]) => {
      event.detail.errors.forEach(error => {
        if (!error?.moduleName) {
          isRuntimeCompileError = true;
        }

        const parsedError = parseCompileError(error);

        if (!parsedError) {
          return;
        }

        const { name, message, ...traceLine } = parsedError;
        mapCompileStackFrame(traceLine).then(frame => {
          dispatch({
            type: 'add',
            payload: {
              name: name,
              message: message,
              type: 'compile',
              frames: frame ? [frame] : [], // TODO what happens when empty
            },
          });
        });
      });
    },
    []
  );

  const clearRuntimeErrorListener = useCallback(() => {
    dispatch({
      type: 'clear',
      payload: {
        type: 'runtime',
        emptyCallback: () => {
          window.parent.dispatchEvent(new CustomEvent(OverlayEventName.Close));
        },
      },
    });
  }, []);

  const clearCompileErrorListener = useCallback(() => {
    dispatch({
      type: 'clear',
      payload: {
        type: 'compile',
        emptyCallback: () => {
          // Do full page reload in case of a runtime compile error
          if (isRuntimeCompileError) {
            window.parent.document.location.reload();
          } else {
            window.parent.dispatchEvent(
              new CustomEvent(OverlayEventName.Close)
            );
          }
        },
      },
    });
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
