import { parseCompileError } from '@ima/dev-utils/dist/compileErrorParser';
import { useContext, useEffect, useState } from 'react';

import { OverlayContext } from '@/components';
import { SourceStorage } from '@/entities';
import { ParsedError } from '@/types';
import { mapCompileStackFrame, mapStackFramesToOriginal } from '@/utils';

const COMPILE_ERROR_NEEDLES_RE = [/error:\s?module/i, /module\sbuild\sfailed/i];

/**
 * Connects error overlay to __IMA_HMR interface.
 */
function useConnect(serverError: string | null) {
  const { publicUrl } = useContext(OverlayContext);
  const [error, setError] = useState<ParsedError | null>(null);

  // Tracks last reported error type for correct clearing
  let lastErrorType: ParsedError['type'] | null = null;
  const sourceStorage = new SourceStorage(publicUrl);

  // Subscribe to HMR events
  useEffect(() => {
    // Parse server error
    (async () => {
      if (!serverError) {
        return;
      }

      try {
        // Parse runtime error
        const { name, message, stack } = JSON.parse(
          serverError
        ) as unknown as Error;

        const frames = await mapStackFramesToOriginal(stack, sourceStorage);

        if (!frames) {
          return;
        }

        setError({
          name,
          message,
          type: 'runtime',
          frames,
        });
      } catch (err) {
        console.error('Unable to parse server error in ima-error-overlay.');
        console.error(err);
      }
    })();

    // Connect to IMA HMR
    if (window?.__IMA_HMR) {
      window.__IMA_HMR.on('close', async () => {
        setError(null);
      });

      window.__IMA_HMR.on('clear', async data => {
        if (
          !data ||
          !data?.type ||
          (data?.type === 'compile' && lastErrorType === 'compile') ||
          (data?.type === 'runtime' && lastErrorType === 'runtime')
        ) {
          setError(null);
          lastErrorType = null;
        }
      });

      window.__IMA_HMR.on('error', async data => {
        if (!data?.error) {
          return;
        }

        lastErrorType = data.type;

        /**
         * The source doesn't know the type of an error.
         * We nee to try to figure out which type it is before continuing.
         */
        if (!lastErrorType) {
          lastErrorType = COMPILE_ERROR_NEEDLES_RE.some(re =>
            re.test(data.error?.message || data.error?.stack || '')
          )
            ? 'compile'
            : 'runtime';
        }

        try {
          // Parse compile error
          if (lastErrorType === 'compile') {
            const parsedError = await parseCompileError(data.error);

            if (!parsedError) {
              return;
            }

            const { message, name } = parsedError;
            const frame = await mapCompileStackFrame(
              parsedError,
              sourceStorage
            );

            if (!frame) {
              return;
            }

            setError({
              name,
              message,
              type: lastErrorType,
              frames: [frame],
            });
          } else if (lastErrorType === 'runtime') {
            // Parse runtime error
            const { name, message, stack } = data.error;
            const frames = await mapStackFramesToOriginal(stack, sourceStorage);

            if (!frames) {
              return;
            }

            setError({
              name,
              message,
              type: lastErrorType,
              frames,
            });
          }

          // Cleanup sources to force latest on next load
          sourceStorage.cleanup();
        } catch (err) {
          console.error('Unable to parse an error in ima-error-overlay.');
          console.error(err);
        }
      });
    }
  }, []);

  return { error, setError };
}

export { useConnect };
