import DocumentView from 'app/document/DocumentView';

export default (ns, oc, config) => {
  let versionStamp = `?version=${config.$Version}`;

  return {
    prod: {
      $Http: {
        defaultRequestOptions: {
          timeout: 7000, // Request timeout
          repeatRequest: 1, // Count of automatic repeated request after failing request.
          ttl: 60000, // Default time to live for cached request in ms.
          headers: {
            // Set default request headers
            Accept: 'application/json',
            'Accept-Language': config.$Language,
          },
          fetchOptions: {
            mode: 'cors',
          },
          cache: true, // if value exists in cache then returned it else make request to remote server.
        },
        cacheOptions: {
          prefix: 'http.', // Cache key prefix for response bodies (already parsed as JSON) of completed HTTP requests.
        },
      },
      $Cache: {
        enabled: true, //Turn on/off cache for all application.
        ttl: 60000, // Default time to live for cached value in ms.
      },
      $Page: {
        $Render: {
          styles: [`/static/css/app.min.css${versionStamp}`],
          scripts: [
            `/static/locale/${config.$Language}.js${versionStamp}`,
            `/static/js/app.bundle.min.js${versionStamp}`
          ],
          esScripts: [
            `/static/locale/${config.$Language}.js${versionStamp}`,
            `/static/js.es/app.bundle.min.js${versionStamp}`
          ],
          polyfill: {
            fetch: '/static/js/polyfill-fetch.js'
          },
          documentView: DocumentView
        }
      },
      links: {
        documentation: 'https://imajs.io/docs',
        tutorial: 'https://imajs.io/tutorial/introduction',
        plugins: 'https://github.com/seznam/IMA.js-plugins',
        api: 'https://imajs.io/api'
      }
    },

    dev: {
      $Http: {
        defaultRequestOptions: {
          timeout: 2000,
        },
      },
      $Page: {
        $Render: {
          styles: [`/static/css/app.css${versionStamp}`],
          scripts: [
            // `/static/js/polyfill.js${versionStamp}`,
            `/static/locale/${config.$Language}.js${versionStamp}`,
            `/static/js/runtime.js${versionStamp}`,
            `/static/js/vendors.js${versionStamp}`,
            `/static/js/app.client.js${versionStamp}`
          ],
          esScripts: [
            // `/static/js.es/polyfill.js${versionStamp}`,
            `/static/locale/${config.$Language}.js${versionStamp}`,
            `/static/js.es/runtime.js${versionStamp}`,
            `/static/js.es/vendors.js${versionStamp}`,
            `/static/js.es/app.client.js${versionStamp}`
          ]
        }
      }
    }
  };
};
