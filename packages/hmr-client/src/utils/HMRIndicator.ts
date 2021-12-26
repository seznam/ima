import hmrIndicatorHtml from '../public/hmrIndicator.html';

const HMR_INDICATOR_ID = 'ima-hmr-indicator-a5d222fc45fc';

class HMRIndicator {
  private destroyTimeout: number | undefined;

  get indicator(): HTMLDivElement | null {
    const div = document.getElementById(HMR_INDICATOR_ID);

    if (!div) {
      return null;
    }

    return div as HTMLDivElement;
  }

  create(type: 'invalid' | 'loading' = 'loading'): void {
    if (this.indicator) {
      // Update class name
      this.indicator.className = `${HMR_INDICATOR_ID}--${type}`;

      return;
    }

    const indicatorDiv = document.createElement('div');

    indicatorDiv.id = HMR_INDICATOR_ID;
    indicatorDiv.innerHTML = hmrIndicatorHtml;
    indicatorDiv.className = `${HMR_INDICATOR_ID}--${type}`;
    indicatorDiv.style.position = 'fixed';
    indicatorDiv.style.zIndex = '2147483647';
    indicatorDiv.style.bottom = '15px';
    indicatorDiv.style.right = '15px';
    indicatorDiv.style.transition = 'opacity 0.15s ease-out';
    indicatorDiv.style.opacity = '1';

    // Append to body
    document.body.appendChild(indicatorDiv);
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
