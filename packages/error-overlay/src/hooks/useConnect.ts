import { parseCompileError } from '@ima/dev-utils/dist/compileErrorParser';
import { useContext, useEffect, useState } from 'react';
import { SourceMapConsumer } from 'source-map';

import { OverlayContext } from '#/components';
import { SourceStorage } from '#/entities';
import { ParsedError } from '#/types';
import { mapCompileStackFrame, mapStackFramesToOriginal } from '#/utils';

/**
 * Connects error overlay to __IMA_HMR interface.
 */
function useConnect(serverError: string | null) {
  const { publicUrl } = useContext(OverlayContext);
  const [error, setError] = useState<ParsedError | null>(null);
  const sourceStorage = new SourceStorage(publicUrl);

  // Subscribe to HMR events
  useEffect(() => {
    // Needed to enable source map parsing
    // @ts-expect-error: Not available in typings
    SourceMapConsumer.initialize({
      'lib/mappings.wasm': `${publicUrl}/__error-overlay-static/mappings.wasm`,
    });

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

      window.__IMA_HMR.on('clear', async () => {
        setError(null);
      });

      window.__IMA_HMR.on('error', async data => {
        if (!data) {
          return;
        }

        try {
          // Parse compile error
          if (data.type === 'compile') {
            const parsedError = await parseCompileError(data.error);

            if (!parsedError) {
              return;
            }

            const { message, name, column, fileUri, line } = parsedError;
            const frame = await mapCompileStackFrame(
              fileUri,
              line,
              column,
              sourceStorage
            );

            if (!frame) {
              return;
            }

            setError({
              name,
              message,
              type: data.type,
              frames: [frame],
            });
          } else if (data.type === 'runtime') {
            // Parse runtime error
            const { name, message, stack } = data.error;
            const frames = await mapStackFramesToOriginal(stack, sourceStorage);

            if (!frames) {
              return;
            }

            setError({
              name,
              message,
              type: data.type,
              frames,
            });
          }

          // Cleanup wasm allocated sourcemaps
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
