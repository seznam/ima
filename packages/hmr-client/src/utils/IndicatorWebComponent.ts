class IndicatorWebComopnent extends HTMLElement {
  private _root: HTMLDivElement | undefined;
  private _icon: HTMLImageElement | undefined;

  static get observedAttributes() {
    return ['state'];
  }

  public connectedCallback() {
    this.attachShadow({ mode: 'open' });

    // Init styles
    this._initStyles();

    // Create hmr indicator
    this._createIndicator();
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'state') {
      this._icon?.setAttribute(
        'class',
        `ima-hmr-indicator__icon ima-hmr-indicator__icon--${newValue}`
      );
    }
  }

  private _createIndicator(): void {
    this._root = document.createElement('div');
    this._icon = document.createElement('img');

    this._root.classList.add('ima-hmr-indicator__wrapper');
    this._icon.classList.add(
      'ima-hmr-indicator__icon',
      `ima-hmr-indicator__icon--${this.getAttribute('state') ?? 'loading'}`
    );

    this._icon.src =
      'data:image/png;base64,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';
    this._root.appendChild(this._icon);

    this.shadowRoot?.appendChild(this._root);
  }

  private _initStyles(): void {
    const styles = document.createElement('style');
    styles.innerHTML = `
    :host {
      position: fixed;
      right: 15px;
      bottom: 15px;
      z-index: 2147483647;

      transition: opacity 0.15s ease-out;
      opacity: 1;
    }

    @keyframes ima-hmr-indicator__hourglass {
      0% {
        transform: rotate(0);
        animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      }

      50% {
        transform: rotate(540deg);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }

      100% {
        transform: rotate(1080deg);
      }
    }

    @keyframes ima-hmr-indicator__fade-in-down {
      0% {
        transform: translateY(0) scale(0.9);
        opacity: 0;
      }

      100% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    .ima-hmr-indicator__wrapper {
      display: inline-flex;

      border-radius: 4px;
      padding: 8px;

      justify-content: center;
      align-content: center;

      background: white;

      box-shadow: 0 5px 14px -3px rgba(100, 116, 139, 0.7), 0 3px 4px -4px rgba(100, 116, 139, 0.7);

      animation: ima-hmr-indicator__fade-in-down 0.15s ease-in;
    }

    .ima-hmr-indicator__icon {
      width: 16px;
      height: 16px;
    }

    .ima-hmr-indicator__icon--loading {
      animation: ima-hmr-indicator__hourglass 1.8s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .ima-hmr-indicator__icon--invalid {
      filter: grayscale();
      opacity: 0.6;
    }
    `;

    this.shadowRoot?.appendChild(styles);
  }
}

customElements.define('ima-hmr-indicator', IndicatorWebComopnent);
