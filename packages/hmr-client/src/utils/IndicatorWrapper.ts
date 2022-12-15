import './IndicatorWebComponent';

export const HMR_INDICATOR_ID = 'ima-hmr-indicator';

export class IndicatorWrapper {
  private destroyTimeout: number | undefined;

  get indicator(): HTMLElement | null {
    const indicatorElement = document.getElementById(HMR_INDICATOR_ID);

    if (!indicatorElement) {
      return null;
    }

    return indicatorElement as HTMLElement;
  }

  create(state: 'invalid' | 'loading' = 'loading'): void {
    // Update existing indicator state
    if (this.indicator) {
      this.indicator.setAttribute('state', state);

      return;
    }

    const indicatorElement = document.createElement('ima-hmr-indicator');
    indicatorElement.setAttribute('id', HMR_INDICATOR_ID);
    indicatorElement.setAttribute('state', state);

    // Append to body
    document.body.appendChild(indicatorElement);
  }

  destroy(): void {
    window.clearTimeout(this.destroyTimeout);

    if (!this.indicator) {
      return;
    }

    this.indicator.style.opacity = '0';
    this.destroyTimeout = window.setTimeout(() => {
      if (!this.indicator) {
        return;
      }

      this.indicator.remove();
    }, 150);
  }
}

/**
 * Returns singleton instance of IndicatorWebComponent.
 */
export function getIndicator() {
  if (!window.__IMA_HMR?.indicator) {
    window.__IMA_HMR = window.__IMA_HMR || {};
    window.__IMA_HMR.indicator = new IndicatorWrapper();
  }

  return window.__IMA_HMR.indicator;
}
