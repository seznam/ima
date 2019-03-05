(function() {
  console.log('HOT RELOADING'); //eslint-disable-line no-console

  if (!('WebSocket' in window)) {
    console.error('Hot reloading: WebSocket is not supported by this browser.'); //eslint-disable-line no-console
    return;
  }

  var hostname = window.location.hostname || 'localhost';
  var myWebSocket = new WebSocket('ws://' + hostname + ':5888');

  myWebSocket.onmessage = function(ev) {
    var data = JSON.parse(ev.data);
    console.log('Resource ' + data.resourceURL + ' has just been replaced.'); //eslint-disable-line no-console

    if (/static\/js\//.test(data.resourceURL)) {
      $IMA.$DevTool.clearAppSource();

      (0, eval)(data.contents);

      $IMA.HotReload = true;

      $IMA.Loader.initAllModules()
        .then(function() {
          return $IMA.Loader.import('app/main').then(function(appMain) {
            appMain.ima.hotReloadClientApp(
              appMain.getInitialAppConfigFunctions()
            );
            $IMA.HotReload = false;
          });
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };
})();
