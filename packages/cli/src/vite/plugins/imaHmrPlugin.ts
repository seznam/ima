import { Plugin } from 'vite';

export const IMA_FILE_CHANGED_EVENT = 'ima:file-changed';

export type ImaFileChangedPayload = {};

declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'ima:file-changed': ImaFileChangedPayload;
  }
}

/**
 * Vite plugin that sends a custom `ima:file-changed` event to the client
 * whenever a file is created, modified, or deleted during development.
 *
 * Client code can subscribe using `import.meta.hot`:
 * ```ts
 * if (import.meta.hot) {
 *   import.meta.hot.on('ima:file-changed', () => {
 *     console.log('File changed');
 *   });
 * }
 * ```
 * 
 * This is used by devErrorView in @ima/server.
 * 
 * Original idea was to use native vite events like `vite:afterUpdate`, or `vite:beforeFullReload`,
 * but they are not triggered in some cases (oddly, after a server restart, 
 * when the first server render is an error page, then followup update events are not sent to the client).
 * If we can find a way to make vite's native events work in all cases, we can remove this plugin and
 * update the devErrorView to listen to those events instead.
 */
export function imaHmrPlugin(): Plugin {
  return {
    name: 'ima:hmr',
    apply: 'serve',

    applyToEnvironment(environment) {
      return environment.config.consumer === 'client';
    },

    hotUpdate() {
      this.environment.hot.send(IMA_FILE_CHANGED_EVENT, {});
    },
  };
}
