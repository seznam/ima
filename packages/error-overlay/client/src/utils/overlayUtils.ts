// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import overlayIndexHtml from './overlayIndex.html';

const IFRAME_ID = 'ima-error-overlay';

function createOverlayIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.id = IFRAME_ID;
  iframe.src = 'about:blank';

  // Iframe styles
  iframe.style.border = 'none';
  iframe.style.height = '100%';
  iframe.style.left = '0';
  iframe.style.minHeight = '100vh';
  iframe.style.minHeight = '-webkit-fill-available';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.width = '100vw';
  iframe.style.zIndex = '2147483647';

  // Insert into body
  document.body.appendChild(iframe);

  // Insert overlay html into iframe contents
  iframe.contentWindow?.document.open();
  iframe.contentWindow?.document.write(overlayIndexHtml);
  iframe.contentWindow?.document.close();

  return iframe;
}

export { createOverlayIframe };
