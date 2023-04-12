import {
  parseCompileError,
  resolveErrorType,
} from '@ima/dev-utils/compileErrorParser';
import { useContext, useEffect, useState } from 'react';
import { StatsError } from 'webpack';

import { OverlayContext } from '@/components';
import { SourceStorage } from '@/entities';
import { ParsedError } from '@/types';
import { mapCompileStackFrame, mapStackFramesToOriginal } from '@/utils';

async function parseError(
  error: Error | StatsError,
  sourceStorage: SourceStorage
): Promise<ParsedError | undefined> {
  let parsedError: ParsedError | undefined;

  // Try to resolve the type from error contents
  const type = resolveErrorType(error);

  try {
    // Parse compile error
    if (type === 'compile') {
      const compileError = await parseCompileError(error);

      if (!compileError) {
        return;
      }

      const { message, name } = compileError;
      const frame = await mapCompileStackFrame(compileError, sourceStorage);

      if (!frame) {
        return;
      }

      // Cleanup sources to force latest on next load
      sourceStorage.cleanup();

      parsedError = {
        name,
        message,
        type,
        frames: [frame],
      };
    } else if (type === 'runtime') {
      // Parse runtime error
      const { name, message, stack } = error;
      const frames = await mapStackFramesToOriginal(stack, sourceStorage);

      if (!frames) {
        return;
      }

      parsedError = {
        name,
        message,
        type,
        frames,
      };
    }
  } catch (err) {
    console.error('Unable to parse an error in ima-error-overlay.');
    console.error(err);
  }

  // Cleanup sources to force latest on next load
  sourceStorage.cleanup();

  // Append optional error params
  if (parsedError) {
    // @ts-expect-error not typed
    parsedError.params = error?.params || error?._params;
  }

  return parsedError;
}

/**
 * Connects error overlay to __IMA_HMR interface.
 */
function useConnect(serverError: string | null) {
  const { publicUrl } = useContext(OverlayContext);
  const [error, setError] = useState<ParsedError | null>(null);

  // Tracks last reported error type for correct clearing
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
        const parsedError = await parseError(
          JSON.parse(serverError) as unknown as Error,
          sourceStorage
        );

        if (!parsedError) {
          return;
        }

        setError(parsedError);
      } catch (err) {
        console.error('Unable to parse server error in ima-error-overlay.');
        console.error(err);
      }
    })();

    // Connect to IMA HMR
    if (window?.__IMA_HMR?.emitter) {
      window.__IMA_HMR.emitter.on('close', async () => {
        setError(null);
      });

      window.__IMA_HMR.emitter.on('clear', async () => {
        setError(null);
      });

      window.__IMA_HMR.emitter.on('error', async data => {
        if (!data?.error) {
          return;
        }

        const parsedError = await parseError(data?.error, sourceStorage);

        if (!parsedError) {
          return;
        }

        setError(parsedError);
      });

      window.__IMA_HMR.emitter.emit('error-overlay-connected');
    }
  }, []);

  return { error, setError };
}

export { useConnect };
