import { createRoot } from 'react-dom/client';

import App from './App';
import { OverlayContext, defaultOverlayContext } from './components';

import styles from './app.less';

/**
 * Custom web component wrapper.
 */
class ImaErrorOverlay extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    // Create app root element
    const container = document.createElement('div');
    container.setAttribute('data-ima-error-overlay', '');
    const root = createRoot(container);

    // Append styles and root
    styles.use({ target: this.shadowRoot });
    this.shadowRoot?.appendChild(container);

    // Get component attributes
    const publicUrl = this.getAttribute('public-url');
    const serverError = this.getAttribute('server-error');

    // Render App
    root.render(
      <OverlayContext.Provider
        value={{
          publicUrl: publicUrl ?? defaultOverlayContext.publicUrl,
        }}
      >
        <App serverError={serverError} />
      </OverlayContext.Provider>
    );
  }
}

customElements.define('ima-error-overlay', ImaErrorOverlay);
