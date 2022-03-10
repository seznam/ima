import ReactDOM from 'react-dom';

import { App } from './src/App';

import styles from './index.less';

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

    // Get component attributes
    const publicUrl = this.getAttribute('public');

    // Render App
    ReactDOM.render(<App publicUrl={publicUrl} />, root);
  }
}

customElements.define('ima-error-overlay', ImaErrorOverlay);
