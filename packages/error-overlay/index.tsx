import ReactDOM from 'react-dom';

import { App } from './src/App';
import { OverlayContext, defaultOverlayContext } from './src/components';

import globalStyles from './src/globalStyles.less';
import styles from './src/styles.less';

/**
 * Custom web component wrapper.
 */
class ImaErrorOverlay extends HTMLElement {
  connectedCallback() {
    // Attach to shadow dom
    this.attachShadow({ mode: 'open' });

    // Create app root element
    const root = document.createElement('div');
    root.setAttribute('data-ima-error-overlay', '');

    // Append styles and root
    styles.use({ target: this.shadowRoot });
    this.shadowRoot?.appendChild(root);

    // Init global styles
    globalStyles.use();

    // Get component attributes
    const publicUrl = this.getAttribute('public-url');

    // Render App
    ReactDOM.render(
      <OverlayContext.Provider
        value={{
          publicUrl: publicUrl ?? defaultOverlayContext.publicUrl,
        }}
      >
        <App />
      </OverlayContext.Provider>,
      root
    );
  }
}

customElements.define('ima-error-overlay', ImaErrorOverlay);
