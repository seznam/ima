import './HMRIndicatorElement';

const HMR_INDICATOR_ID = 'ima-hmr-indicator';

class HMRIndicator {
  private destroyTimeout: number | undefined;

  get indicator(): HTMLElement | null {
    const indicatorElement = document.getElementById(HMR_INDICATOR_ID);

    if (!indicatorElement) {
      return null;
    }

    return indicatorElement as HTMLElement;
  }

  create(type: 'invalid' | 'loading' = 'loading'): void {
    // Update existing indicator state
    if (this.indicator) {
      this.indicator.setAttribute('state', type);

      return;
    }

    const indicatorElement = document.createElement('ima-hmr-indicator');
    indicatorElement.setAttribute('id', HMR_INDICATOR_ID);
    indicatorElement.setAttribute('state', type);

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

export { HMR_INDICATOR_ID, HMRIndicator };
