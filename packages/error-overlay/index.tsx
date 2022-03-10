import ReactDOM from 'react-dom';

import { App } from './src/App';

import styles from './index.less';

/**
 * Define custom web component wrapper.
 */
class ImaErrorOverlay extends HTMLElement {
  connectedCallback() {
    const root = document.createElement('div');
    root.classList.add('ima-error-overlay');

    this.attachShadow({ mode: 'open' });

    // Get component attributes
    const publicUrl = this.getAttribute('public');

    // Append styles and root
    styles.use({ target: this.shadowRoot });
    this.shadowRoot?.appendChild(root);

    // Render App
    ReactDOM.render(<App public={publicUrl} />, root);
  }
}

customElements.define('ima-error-overlay', ImaErrorOverlay);
