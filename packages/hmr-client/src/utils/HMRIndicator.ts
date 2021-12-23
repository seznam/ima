import hmrIndicatorHtml from '../public/hmrIndicator.html';

const HMR_INDICATOR_ID = 'ima-hmr-indicator-a5d222fc45fc';

function getHmrIndicator(): HTMLDivElement | null {
  const div = document.getElementById(HMR_INDICATOR_ID);

  if (!div) {
    return null;
  }

  return div as HTMLDivElement;
}

function createHmrIndicator(type: 'invalid' | 'loading' = 'loading'): void {
  const indicator = getHmrIndicator();

  if (indicator) {
    // Update class name
    indicator.className = `${HMR_INDICATOR_ID}--${type}`;

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

  // Append to body
  document.body.appendChild(indicatorDiv);
}

function destroyHmrIndicator(): void {
  const indicator = getHmrIndicator();

  if (!indicator) {
    return;
  }

  indicator.remove();
}

export {
  HMR_INDICATOR_ID,
  getHmrIndicator,
  createHmrIndicator,
  destroyHmrIndicator
};
