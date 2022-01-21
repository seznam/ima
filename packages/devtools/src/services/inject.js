/**
 * @typedef {string}     InjectResourceType
 * @enum    {InjectResourceType}
 */
export const InjectType = Object.freeze({
  SCRIPT: 'script',
  STYLE: 'style',
});

/**
 * Takes care of injecting entire JS or CSS source files into the website
 *
 * @param   {string}             src
 * @param   {InjectResourceType} resourceType
 * @param   {boolean}            removeOnceExecuted
 * @param   {HTMLElement}        rootElement
 * @param   {string}             action
 * @returns {Promise<any>}
 */
export function injectFile(
  src,
  resourceType = InjectType.SCRIPT,
  removeOnceExecuted = true,
  rootElement = document.head || document.documentElement,
  action = 'appendChild'
) {
  return new Promise((resolve, reject) => {
    if (!rootElement) {
      reject(new Error('Missing parent rootElement'));
      return;
    }

    // Resolve src to chrome extension url
    const url = chrome.extension.getURL(src);

    let element = null;
    if (resourceType === InjectType.SCRIPT) {
      element = document.createElement('script');
      element.src = url;
    } else {
      element = document.createElement('link');
      element.rel = 'stylesheet';
      element.href = url;
    }

    // We want to remove scripts once they execute, but styles has to stay
    element.onload = () => {
      if (resourceType === InjectType.SCRIPT && removeOnceExecuted) {
        element.remove();
      }
      resolve();
    };

    element.onerror = error => {
      element.remove();
      reject(error);
    };

    if (action === 'appendChild' || action === 'prepend') {
      rootElement[action](element);
    } else {
      const parentContainer = rootElement.parentNode;
      parentContainer[action](element, parentContainer.firstChild);
    }
  });
}

/**
 * Takes care of injecting JS or CSS code into website
 *
 * @param   {string}             code
 * @param   {InjectResourceType} resourceType
 * @param   {boolean}            removeOnceExecuted
 * @param   {HTMLElement}        rootElement
 * @param   {string}             action
 * @returns {Promise<any>}
 */
export function injectCode(
  code,
  resourceType = InjectType.SCRIPT,
  removeOnceExecuted = true,
  rootElement = document.head || document.documentElement || document.body,
  action = 'appendChild'
) {
  return new Promise((resolve, reject) => {
    if (!rootElement) {
      reject(new Error('Missing parent rootElement'));
      return;
    }

    let element = null;
    if (resourceType === InjectType.SCRIPT) {
      element = document.createElement('script');
    } else {
      element = document.createElement('style');
    }

    element.textContent = code;

    if (action === 'appendChild' || action === 'prepend') {
      rootElement[action](element);
    } else {
      const parentContainer = rootElement.parentNode;
      parentContainer[action](element, parentContainer.firstChild);
    }

    if (resourceType === InjectType.SCRIPT && removeOnceExecuted) {
      element.remove();
    }

    resolve();
  });
}
