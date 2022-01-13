import { useCallback } from 'react';

import { OverlayEventName } from '#/types';

function useBridgeInterface(): {
  closeOverlay(): void;
  isSSRError: boolean;
} {
  const closeOverlay = useCallback(() => {
    window.parent.dispatchEvent(new CustomEvent(OverlayEventName.Close));
  }, []);

  return {
    closeOverlay,
    isSSRError: !!window.__ima_server_error
  };
}

export { useBridgeInterface };