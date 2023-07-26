# Change Log

## 19.1.1

### Patch Changes

- 1b07412fa: Prevent XSS for meta tags where application not clear html from user input.

## 19.1.0

### Minor Changes

- efcf9b99a: Environment $Server properties host&protocol now accepts functions with added arguments.

## 19.0.4

### Patch Changes

- 0ae36c8f4: Fixed async attribute value in web script resources

## 19.0.3

### Patch Changes

- f471ff62b: Allow applicationFolder to be overriden

## 19.0.2

### Patch Changes

- 9cf262c73: Fixed incorrectly rendered meta properties, where they would render as `<meta name="og:title" property="Test Page" /> instead of `<meta property="og:title" content="Test Page" />`.

## 19.0.1

### Patch Changes

- 2323c6a13: Updated dependencies to use non-rc version ranges

## 19.0.0

### Major Changes

- 81a8605d5: Bump versions
- ceb4cbd12: #### Breaking changes

  Dropped support for direct `response.contentVariables` mutations, use `event.result` and return in `CreateContentVariables` event.
  Dropped support for `$Source`, `$RevivalSettings`, `$RevivalCache`, `$Runner`, `$Styles`, `$Scripts` content variables. These have been replaced by their `lowerFirst` counter-parts `source`, `revivalSettings`, `revivalCache`, `runner`, `styles`, `scripts`, while `$Scripts` support have been dropped completely.

- 021c103fa: add new metric concurrent requests to monitoring. Update dependency esmj/monitor to 0.4.0.
- 895f31400: Migrated urlParser middleware to ima server BeforeRequest hook
  #### Breaking Change
  Remove `urlParser` middleware from `app.js`, it is now part of `renderApp` middleware.
- 9ea9018d7: Default resources in $Resources now produce styles and esStyles fields. This does not necessarily mean which should be loaded on which es version, but what bundle produced those styles. This also means that without any custom configuration, all styles should now be under `esStyles` key, since they are built in client.es webpack bundle.
  #### BREAKING CHANGE
  The package now provides named exports, the deafult export has been replaced with named `createIMAServer` function.
- ceb4cbd12: Added new iterator functions to MetaManager.
  Added ability to set additional attributes for meta tags/links in meta manager.
  Meta values/attributes with null/undefined values are not rendered, other values are converted to string.

  #### Breaking changes

  Rewritten meta tag management in SPA mode, all MetaManager managed tags are removed between pages while new page contains only those currently defined using `setMetaParams` function in app controller. This should make meta tags rendering more deterministic, while fixing situations where old meta tags might be left on the page indefinitely if not cleaner properly.
  MetaManager get\* methods now always return object with key=value pairs of their set value. This should make settings additional meta attributes in loops much easier (for example: `getMetaProperty('og:title');` -> `{ property: 'property-value' });`)
  `$Source` env variable has been renamed to `$Resources`.

- ca55af922: Add `routeName` key to `res.locals` instead of `res.$IMA`, since `res.$IMA` should not be used anymore.
- ceb4cbd12: Moved meta tags management to new PageMetaHandler in `@ima/core`.
- c0fe68ef3: IMA 19 Release

### Minor Changes

- 2f789cdae: Add support for Client Errors and Redirects when serving static error pages.
- 6510a25f6: Add information about error cause in places, where we used to throw away this information.
- 7c9cf6997: Style content variable now automatically generates preload links for app styles.
- bedc7e0bb: environment?.$Server?.host and environment?.$Server?.protocol can now be functions
- 1a4c07a96: Added option to force app host and protocol, using `$Server.host` and `$Server.protocol` settings in the environment.js

### Patch Changes

- 394fc8985: update @esmj/monitor to 0.5.0 with breaking change for returns value from subscribe method where returns subscription is object with unsubscribe method.
- eee60ef09: Add option to use custom manifestRequire
- cd8af3a1b: fix devutils default value
- 71f33a761: Final release of all RC ima@19 packages
- 90d0121f2: Fixed IMA@18 and IMA@19 todos
- 1f636bbfb: Fixed issue where server redirect showed ErrorOverlay in debug mode
- 5919b93d7: The App error route is protected for exceeding static thresholds.
- 6050cdb5d: Type fixes
  Added additional missing exports
- 1a8d16890: Added `X-Request-ID` to revival settings. Can be accesed through $IMA.$RequestID
- 552d4e17f: Fixed issue with dummyApp forcing 'en' language, which fails to resolve on applications with different language settings
- 5c5b037e0: SPA blacklist config is omitted for using degradation isSPA method when decision serving SPA page.
- bfb1f48bb: The Emitter event.cause is removed. The error cause is set in event.error.cause.
- 793a59813: override server devUtils and environment in createIMAServer
- d2e426d75: The instances of $Dispatcher, $Cache, $PageRenderer and $PageManager is cleared after server sending response. Clearing PageManager cause calling `destroy` lifecycle method of controller and extensions on server.
- 804a51612: Added XSS protection to host and protocol in revival settings

## 19.0.0-rc.10

### Patch Changes

- 5c5b037e0: SPA blacklist config is omitted for using degradation isSPA method when decision serving SPA page.

## 19.0.0-rc.9

### Minor Changes

- bedc7e0bb: environment?.$Server?.host and environment?.$Server?.protocol can now be functions

## 19.0.0-rc.8

### Patch Changes

- 6050cdb5d: Type fixes
  Added additional missing exports

## 19.0.0-rc.7

### Major Changes

- 9ea9018d7: Default resources in $Resources now produce styles and esStyles fields. This does not necessarily mean which should be loaded on which es version, but what bundle produced those styles. This also means that without any custom configuration, all styles should now be under `esStyles` key, since they are built in client.es webpack bundle.
  #### BREAKING CHANGE
  The package now provides named exports, the deafult export has been replaced with named `createIMAServer` function.

### Patch Changes

- 71f33a761: Final release of all RC ima@19 packages
- 793a59813: override server devUtils and environment in createIMAServer

## 19.0.0-rc.6

### Major Changes

- 895f31400: Migrated urlParser middleware to ima server BeforeRequest hook
  #### Breaking Change
  Remove `urlParser` middleware from `app.js`, it is now part of `renderApp` middleware.

### Minor Changes

- 7c9cf6997: Style content variable now automatically generates preload links for app styles.

### Patch Changes

- 1f636bbfb: Fixed issue where server redirect showed ErrorOverlay in debug mode
- d2e426d75: The instances of $Dispatcher, $Cache, $PageRenderer and $PageManager is cleared after server sending response. Clearing PageManager cause calling `destroy` lifecycle method of controller and extensions on server.

## 19.0.0-rc.5

### Patch Changes

- eee60ef09: Add option to use custom manifestRequire
- cd8af3a1b: fix devutils default value
- 552d4e17f: Fixed issue with dummyApp forcing 'en' language, which fails to resolve on applications with different language settings

## 19.0.0-rc.4

### Patch Changes

- 5919b93d7: The App error route is protected for exceeding static thresholds.
- bfb1f48bb: The Emitter event.cause is removed. The error cause is set in event.error.cause.

## 19.0.0-rc.3

### Patch Changes

- 394fc8985: update @esmj/monitor to 0.5.0 with breaking change for returns value from subscribe method where returns subscription is object with unsubscribe method.

## 19.0.0-rc.2

### Major Changes

- 81a8605d5: Bump versions

## 19.0.0-rc.1

### Major Changes

- 021c103fa: add new metric concurrent requests to monitoring. Update dependency esmj/monitor to 0.4.0.

### Minor Changes

- 6510a25f6: Add information about error cause in places, where we used to throw away this information.

### Patch Changes

- 90d0121f2: Fixed IMA@18 and IMA@19 todos
- 1a8d16890: Added `X-Request-ID` to revival settings. Can be accesed through $IMA.$RequestID
- 804a51612: Added XSS protection to host and protocol in revival settings

## 19.0.0-rc.0

### Major Changes

- ceb4cbd12: #### Breaking changes

  Dropped support for direct `response.contentVariables` mutations, use `event.result` and return in `CreateContentVariables` event.
  Dropped support for `$Source`, `$RevivalSettings`, `$RevivalCache`, `$Runner`, `$Styles`, `$Scripts` content variables. These have been replaced by their `lowerFirst` counter-parts `source`, `revivalSettings`, `revivalCache`, `runner`, `styles`, `scripts`, while `$Scripts` support have been dropped completely.

- ceb4cbd12: Added new iterator functions to MetaManager.
  Added ability to set additional attributes for meta tags/links in meta manager.
  Meta values/attributes with null/undefined values are not rendered, other values are converted to string.

  #### Breaking changes

  Rewritten meta tag management in SPA mode, all MetaManager managed tags are removed between pages while new page contains only those currently defined using `setMetaParams` function in app controller. This should make meta tags rendering more deterministic, while fixing situations where old meta tags might be left on the page indefinitely if not cleaner properly.
  MetaManager get\* methods now always return object with key=value pairs of their set value. This should make settings additional meta attributes in loops much easier (for example: `getMetaProperty('og:title');` -> `{ property: 'property-value' });`)
  `$Source` env variable has been renamed to `$Resources`.

- ca55af922: Add `routeName` key to `res.locals` instead of `res.$IMA`, since `res.$IMA` should not be used anymore.
- ceb4cbd12: Moved meta tags management to new PageMetaHandler in `@ima/core`.
- c0fe68ef3: IMA 19 Release

### Minor Changes

- 2f789cdae: Add support for Client Errors and Redirects when serving static error pages.
- 1a4c07a96: Added option to force app host and protocol, using `$Server.host` and `$Server.protocol` settings in the environment.js

### Patch Changes

- Updated dependencies [073adb5d5]
- Updated dependencies [c0fe68ef3]
  - @ima/dev-utils@19.0.0-rc.0
  - @ima/helpers@19.0.0-rc.0

## 18.3.4

### Patch Changes

- e2b89569c: Updated dependency @esmj/monitor:^0.5.1

## 18.3.3

### Patch Changes

- 18e6cab06: Fix export of devUtilsFactory

## 18.3.2

### Patch Changes

- 41d7d3b56: allow devUtils to be overriden in createIMAServer

## 18.3.1

### Patch Changes

- a980951af: Fix missing `chalk` dependency

## 18.3.0

### Minor Changes

- a7de413a2: Replaced locale-loader with custom compilation process of language files, this fixes an issue where newly added language files are not visible by the webpack compile and requires restart with forced cache clear.
  Implemented custom solution for hot module replacement API for language files (HMR for language files should be much faster and only )

## 18.2.1

### Patch Changes

- 7ede4a192: Fixed default invalid static path and default PUBLIC_PATH config

## 18.2.0

### Minor Changes

- f66d8808b: Added ability to set custom publicPath during runtime using IMA_PUBLIC_PATH env variable
  Proper handling of publicPath in assets serving and sources fallbacks

### Patch Changes

- f07da7c17: Fix urlParserMiddleware with missing ima.config.js

## 18.1.5

### Patch Changes

- 121a44bc7: update @esmj/monitor dependency to 0.3.0
- 026f2434d: Allow extend content variables with returns value from CreatecontentVariable hook.

## 18.1.4

### Patch Changes

- f55268f97: Fix typescript types export

## 18.1.3

### Patch Changes

- b90048405: Moved CreateContentVariables event trigger to beforeResponse event

## 18.1.2

### Patch Changes

- 897457cba: Fix for empty revival-cache returned in contentVariables

## 18.1.1

### Patch Changes

- 9ab1b2ddf: Fixed issue where minified builds failed to execute on client"

## 18.1.0

### Minor Changes

- 06fee90c2: Aded new ContentVariable server event. This allows customization of variables that are injected to content using #{...} interpolation

### Patch Changes

- 4952b4bad: Dictionary is loaded only for defined language. Language can be missing for errors before urlParser middleware.
- 27f7a1204: redirect error is not degradated to static error page
- 58d31d0bf: Client errors render static client error page for exceeded concurrency

## 18.0.3

### Patch Changes

- acabceef: Server degradation functions are optional.

## 18.0.2

### Patch Changes

- b71bb4a2: update esmj/emitter to 0.2.0

## 18.0.1

### Patch Changes

- 8b84abce: Fixed freezed peerDependencies

## 18.0.0

### Major Changes

- 91c4c409: ### Bug Fixes

  - 🐛 crash watch mode after server crashed ([ca798bf](https://github.com/seznam/ima/commit/ca798bf8d971fff654faf1bc1426b3bfbfa71519))
  - 🐛 Fixed broken build ([e070f36](https://github.com/seznam/ima/commit/e070f36aec7a347237eb9d20092d3a8bb3faaad5))
  - 🐛 Fixed lint hangup on docs pkg ([0104200](https://github.com/seznam/ima/commit/0104200678b3ac8d84247465a95dfc892a3185ea))
  - 🐛 Fixed critical bug in compilation of vendors ([26494ce](https://github.com/seznam/ima/commit/26494ce9539fb9882c48ea80b47d48b5f0befeb8))
  - 🐛 hotfix error overlay runtime error parsing ([947ed6c](https://github.com/seznam/ima/commit/947ed6c52003d7a8e91831a414bd84f9bda13a2c))
  - 🐛 Improved error reporting to error-overlay ([7eeb707](https://github.com/seznam/ima/commit/7eeb7078061992ef809ac3c45cd5386e1cc780f6))
  - 🐛 Replaced source-map with source-map-js ([#218](https://github.com/seznam/ima/issues/218)) ([f201896](https://github.com/seznam/ima/commit/f20189683eae9874b7c2ae1b1d3544d0636a4dcc))
  - 🐛 Removed rogue console.log ([8fa0c5b](https://github.com/seznam/ima/commit/8fa0c5b960b5936cc557748fe325afb15a06d243))
  - 🐛 Fixed issue with displaying compile errors in overlay ([#210](https://github.com/seznam/ima/issues/210)) ([0e8ba96](https://github.com/seznam/ima/commit/0e8ba9697f8f0ac1cca223766e858e5d8ba5fff8))
  - 🐛 Fixed PostCSS webpack plugins source maps handling ([#209](https://github.com/seznam/ima/issues/209)) ([fe6af03](https://github.com/seznam/ima/commit/fe6af038f091b6929af872ecae4afe7f5e84d78e))
  - 🐛 Added misssing template dependency ([e05d835](https://github.com/seznam/ima/commit/e05d83593e153c90e77080d8c5a36765f245553c))
  - 🐛 Added uknown error filter to hmr client ([38a5929](https://github.com/seznam/ima/commit/38a5929bb2b5fed457b3d486f15f44fe91f0cbae))
  - 🐛 AMP and scrambleCSS plugins bugfixes ([2eec6c3](https://github.com/seznam/ima/commit/2eec6c3bca22a48ade6a171e5b863b825063ab62))
  - 🐛 babel parser fixes, fixed new compile format err parsing ([63db8e7](https://github.com/seznam/ima/commit/63db8e711f27dd31163db301324ad1cf835e320c))
  - 🐛 Benchmark fix ([7743870](https://github.com/seznam/ima/commit/774387046fdf54f1460c94d4b87d259a1d8dbfd8))
  - 🐛 Better error handling in compiler, overlay and hmr ([ce101e3](https://github.com/seznam/ima/commit/ce101e37557e3929b287c50c734c6ab46cec57cb))
  - 🐛 Clone HttpAgent internalCacheOfPromise result ([57aa831](https://github.com/seznam/ima/commit/57aa83166edd7b8d4b54e01c6f8e3dd084273fd5))
  - 🐛 Correct npm registry in package-lock ([578881d](https://github.com/seznam/ima/commit/578881df74807be320e045d8b38b095745f32309))
  - 🐛 css modules build fixes ([7e95183](https://github.com/seznam/ima/commit/7e951835d828c348514fba7096598797c86ac2d7))
  - 🐛 Dev logger fixes ([dd93463](https://github.com/seznam/ima/commit/dd9346389da3f2f580ffaad1c344ec9911512b1f))
  - 🐛 error-overlay and runtime error reporting fixes ([07b9d29](https://github.com/seznam/ima/commit/07b9d2972d7e90c6f8ef943e8f721841e0006882))
  - 🐛 Fix dependency to build.js in urlParser ([604d05a](https://github.com/seznam/ima/commit/604d05a4d8d9d06ecd3ad41640c145e5e7c51e83))
  - 🐛 Fix HMR disconnect on controller error ([3554457](https://github.com/seznam/ima/commit/35544577ca01b2d437bd936efff358cda4cdb987))
  - 🐛 Fix ignoring less files when CSSModules are disabled ([590050d](https://github.com/seznam/ima/commit/590050dbff65da709dc88be0413ea4b569000976))
  - 🐛 Fix localize from hook ([28c3f50](https://github.com/seznam/ima/commit/28c3f5080f210ac8f7270e2cea262aca9ea039a3))
  - 🐛 Fix peer deps in benchmark ([8e94e8f](https://github.com/seznam/ima/commit/8e94e8f82eb45f5474c42ffcfe9bababc4ccb6dc))
  - 🐛 Fixed broken types in CLI package ([bc5a73e](https://github.com/seznam/ima/commit/bc5a73e98120a1a09676a91e475f7cbf54e4c64d))
  - 🐛 fixed build ([107ac2d](https://github.com/seznam/ima/commit/107ac2d32be00128d836276050693b2332305712))
  - 🐛 Fixed compile error parsing ([e9013a3](https://github.com/seznam/ima/commit/e9013a3e1ab020f31621d059a91027ef7b671877))
  - 🐛 fixed dev task ([a25466c](https://github.com/seznam/ima/commit/a25466c89267f171a9c5abec549e8c55d090f2c7))
  - 🐛 Fixed doubling of runtime errors ([2c7cbab](https://github.com/seznam/ima/commit/2c7cbab8fbbc53b874c2bfcfc68537103f529aef))
  - 🐛 Fixed error when there are no localizations ([31a9655](https://github.com/seznam/ima/commit/31a96554831d151dbddc7d5864a504ca69d53b1c))
  - 🐛 Fixed error-overlay view compiled btn text wrapping ([0ca3f1c](https://github.com/seznam/ima/commit/0ca3f1cac96b66ec1aaa2d012a63796559f9ad55))
  - 🐛 Fixed eval-source-map middleware runtime error parsing ([721469d](https://github.com/seznam/ima/commit/721469d8500c62537d833bc1ebb228c905a8ebd7))
  - 🐛 Fixed fastRefreshInterop events ([342e9e7](https://github.com/seznam/ima/commit/342e9e7d47a87b96c2f28ee08fe1869a58141130))
  - 🐛 Fixed forceSPA mode ([7efffbc](https://github.com/seznam/ima/commit/7efffbc89a1b87f9ee224a26ad045e6d4042b7d8))
  - 🐛 Fixed handleError issues and incorrect dependencies ([bf8f7f6](https://github.com/seznam/ima/commit/bf8f7f628b4a77abff8a89306fbd1adf6bfb863a))
  - 🐛 Fixed hot reload in legacy and forceSPA modes ([19e2ed7](https://github.com/seznam/ima/commit/19e2ed74bcbf5189a88b5b884e89a3ce72111bfb))
  - 🐛 Fixed I11 swc config ([6c6047f](https://github.com/seznam/ima/commit/6c6047f22a8d21d49483aec4dd7a81c6cb928ba7))
  - 🐛 Fixed IMA.js SPA mode ([fbbffa2](https://github.com/seznam/ima/commit/fbbffa2c68557dcf27a9c89e1117bb4c3d543245))
  - 🐛 Fixed incorrect error handling in services.js ([cbdddc8](https://github.com/seznam/ima/commit/cbdddc8d6d4398c3f3f7956cadb8c2900e63911e))
  - 🐛 Fixed lengthy server error processing ([a76f1cc](https://github.com/seznam/ima/commit/a76f1cc291da7e1c927180ee51e5ec44f67f0755))
  - 🐛 Fixed logger overlapping newlines issues ([7682081](https://github.com/seznam/ima/commit/7682081139565987fcb9ed6bd24023e40d9b0aad))
  - 🐛 Fixed nodemon logging before server start ([9347f07](https://github.com/seznam/ima/commit/9347f07bc42db491592efc6502b21273a785e730))
  - 🐛 Fixed occasional duplication of progress bar ([05eed21](https://github.com/seznam/ima/commit/05eed2188a54926ac91ffb6dc1a4f6f0463e359a))
  - 🐛 Fixed package dependencies ([3dbbe1f](https://github.com/seznam/ima/commit/3dbbe1ffc23dcde22c79eac93d3429d3a61208de))
  - 🐛 Fixed PROD env, dev error handling ([8c987ff](https://github.com/seznam/ima/commit/8c987ff37e09884e3de8fff9c87f817291bc2a71))
  - 🐛 Fixed production CSS source maps generation ([d2462ac](https://github.com/seznam/ima/commit/d2462acc40a85286cd8a11f46b2e3cf1a5e8e92c))
  - 🐛 Fixed progress plugin ([2c7fe1a](https://github.com/seznam/ima/commit/2c7fe1ac9fde6da744e70ce32871266a8cf6170a))
  - 🐛 Fixed public path cli override ([b135f4b](https://github.com/seznam/ima/commit/b135f4be413dd42be17dde3d372897bfe976e405))
  - 🐛 fixed relative urls in error overlay ([d528717](https://github.com/seznam/ima/commit/d5287173cbaa7aee0f245ddec330127dc99f0418))
  - 🐛 Fixed reloading of locale files ([2f653d7](https://github.com/seznam/ima/commit/2f653d77d1865b5cb4fb321aeba3593bc1918a70))
  - 🐛 Fixed RunImaPlugin ([e33ae30](https://github.com/seznam/ima/commit/e33ae30ee1907b18571309359940cd6c0c86c1ef))
  - 🐛 Fixed server-side HMR ([19b9a24](https://github.com/seznam/ima/commit/19b9a24f59a1138a9ac767ce78b6d51d50b50dff))
  - 🐛 Fixed server-side runtime errors ([b8512eb](https://github.com/seznam/ima/commit/b8512eb07c788432ea293c5d94d4486bb036b504))
  - 🐛 Fixed SWC error parser ([26c1c78](https://github.com/seznam/ima/commit/26c1c783af2c48ca8e96ed2fdb9aa7c101a2dc9f))
  - 🐛 Fixed webpack build getting stuck with multiple es versi ([f9e2a07](https://github.com/seznam/ima/commit/f9e2a078e838b3b20229f853e8292dbc1c517025))
  - 🐛 HMR fixes ([3b9fafd](https://github.com/seznam/ima/commit/3b9fafd7637edc9ac52131fbd77749a40328dfe3))
  - 🐛 hot module updates static path fixes ([1e98408](https://github.com/seznam/ima/commit/1e984083eaa35e824735624880bda139809c9ed8))
  - 🐛 Location of localized files ([b258e21](https://github.com/seznam/ima/commit/b258e21e3f29cea4f272f9142e4030689c34aa09))
  - 🐛 Minor error reporting fixes ([94a53c8](https://github.com/seznam/ima/commit/94a53c8265312315eaaf912d3c294a2a0ac73a75))
  - 🐛 Minor HMR error handling fixes ([1f15b7d](https://github.com/seznam/ima/commit/1f15b7d005e5aa7d9a572b74fa1b7ce17a8bf5b5))
  - 🐛 Minor source storage cache fixes) ([6a2c7d0](https://github.com/seznam/ima/commit/6a2c7d0ea38804a9451a8ac8fce6053c164fe001))
  - 🐛 Multiple overlay style fixes ([a6437c8](https://github.com/seznam/ima/commit/a6437c84a8547d55edcf5d8836aabfb6dde990d2))
  - 🐛 Plugin dynamic binding fix ([1049c7a](https://github.com/seznam/ima/commit/1049c7aa87671c97555a6e2247a3eed7a6c3d207))
  - 🐛 Quick chunkname fix ([e6856e2](https://github.com/seznam/ima/commit/e6856e2cb8d04811f2b55a800460c6148227296d))
  - 🐛 Re-enabled fast refresh ([1f27c9c](https://github.com/seznam/ima/commit/1f27c9cefc43dcbde6a61d5d82c953331aa160e2))
  - 🐛 React deprecated createFactory fix, added --clearCache ([5939c45](https://github.com/seznam/ima/commit/5939c45d5a5a694255cb401f5abd7ef6843a276f))
  - 🐛 removed gsed in benchmark ([db5862f](https://github.com/seznam/ima/commit/db5862f8b63b9767e696faa6a93552e83eafe59f))
  - 🐛 Removed start script from CLI ([1de9631](https://github.com/seznam/ima/commit/1de96310f19ad7fcf6e981d1394b523e2f3f8bef))
  - 🐛 Removed unneeded server.bundle watching ([7474148](https://github.com/seznam/ima/commit/74741481acc00dbd9eae4a7e74ea9c4c80ec2ca0))
  - 🐛 Removed unused manifest plugin ([ebcfc64](https://github.com/seznam/ima/commit/ebcfc64c27e61c07afc5647a299639c666a4481f))
  - 🐛 Reverted back to using mini-css-extract-plugin by defaul ([c9da2f7](https://github.com/seznam/ima/commit/c9da2f7f41f2d2e264cd4205bf383716947112a3))
  - 🐛 Reverted less-extended-loader usage ([eb03447](https://github.com/seznam/ima/commit/eb03447f689aa4a852c00caf1524ed3f2c52c031))
  - 🐛 Reverted mini-css-extract-plugin, native css is optional ([f00c359](https://github.com/seznam/ima/commit/f00c35909f9a8cb21319d00ce830b1075653afaf))
  - 🐛 Scramble css source map support fix ([9cbe36b](https://github.com/seznam/ima/commit/9cbe36baab15790e34ac96e57a2fe165cd3b8222))
  - 🐛 SWC and babel fixes ([4a872dc](https://github.com/seznam/ima/commit/4a872dc441c4dfdaa151da39e3dcb71f193cc165))
  - 🐛 swc compile error parser ([26f9e75](https://github.com/seznam/ima/commit/26f9e7571228b50dfb76d0b7dd1ec241e4748c3e))
  - 🐛 Track unique errors before logging ([6c0f0cf](https://github.com/seznam/ima/commit/6c0f0cf20763f80b59b12fc15c46e0466323cff4))
  - 🐛 tsconfig fixes ([27d3b56](https://github.com/seznam/ima/commit/27d3b56391697273a236d4b83b4fd96bc47a1b85))
  - 🐛 updated packagelocks ([c3d6ce1](https://github.com/seznam/ima/commit/c3d6ce1f8b4d224673793261f60469f3c840b096))
  - 🐛 Verdacio fix ([c1709ff](https://github.com/seznam/ima/commit/c1709ff1399dc5459cce72bc020de693e8f442bc))
  - 🐛 Verdacio fix take 4 ([24f3607](https://github.com/seznam/ima/commit/24f36071fd57483b538693a076914f9ce3032f75))
  - broken test infrastructure for new create-ima-app apps ([#183](https://github.com/seznam/ima/issues/183)) ([53832c7](https://github.com/seznam/ima/commit/53832c79d83f7ed0532eb82abca1fcee0896a79a))

  ### Code Refactoring

  - 💡 keep same interface for mount and update methods ([fbdd705](https://github.com/seznam/ima/commit/fbdd7056b9ad5599bdc9e7b03ee7d29dbc44ed1f))
  - 💡 remove deprectecated clearState method ([7cab3af](https://github.com/seznam/ima/commit/7cab3af498ee100071ab9bc444683dcade7e9ddf))

  ### Features

  - 🎸 Added option to disable non-es build completely ([f15edee](https://github.com/seznam/ima/commit/f15edee847874e150d2fd44a2c09de34ed4b8058))
  - 🎸 Finished CLI documentation and tweaked CIL plugins ([7ae9395](https://github.com/seznam/ima/commit/7ae9395fc847de25f54931ad755f4a5bf0be6e43))
  - 🎸 Migrated from es5, es11 to es9 and es13 versions ([#237](https://github.com/seznam/ima/issues/237)) ([20b108f](https://github.com/seznam/ima/commit/20b108f7de172fd3c40f8b090e40c8a9f4c7de35))
  - 🎸 Removed babel support (swc is now only supported) ([4f1f708](https://github.com/seznam/ima/commit/4f1f7080555b422a2c661c24ab37316460ed04b2))
  - 🎸 ScrambleCss and AnalyzePlugin tweaks + docs ([e3b1f26](https://github.com/seznam/ima/commit/e3b1f262df3a7b4cc34cab2eb47d3abfbf16438c))
  - 🎸 Improved code splitting and swc config ([226fdf0](https://github.com/seznam/ima/commit/226fdf0b9b93ca9a7c176a7910ab24ff6e4946b0))
  - 🎸 Merge language files instead of overwriting ([3ec8ea7](https://github.com/seznam/ima/commit/3ec8ea7873e7dacc3e50103a60475ab1dea671b2))
  - 🎸 Kill already running app on the same port before launch ([#213](https://github.com/seznam/ima/issues/213)) ([3790164](https://github.com/seznam/ima/commit/3790164bd015f6444943fe76b8dc76d0da6f688d))
  - 🎸 Node 18 native fetch support ([#212](https://github.com/seznam/ima/issues/212)) ([69df0a3](https://github.com/seznam/ima/commit/69df0a3bf334217b051f2cb261adc572f0e5093c))
  - 🎸 Accept array of globs with translations ([3e2ee88](https://github.com/seznam/ima/commit/3e2ee881b201088d908583d02dff4788f138120e))
  - 🎸 Added "Open in editor" button in error overlay ([adf5211](https://github.com/seznam/ima/commit/adf52111dba6825b80d0e6641f82cbd166fdf4e9))
  - 🎸 Added ability to override babel and postcss configs ([aef5ef6](https://github.com/seznam/ima/commit/aef5ef6b8762fd4a415baae4591d736840ed3622))
  - 🎸 Added ability to resolve es and non-es babel config ([84f0070](https://github.com/seznam/ima/commit/84f00706d51c8d610c0c429cb3fb4e7f0b53ad6e))
  - 🎸 Added analyze cli plugin ([f6b5026](https://github.com/seznam/ima/commit/f6b5026f43e7c0765e22e25f10e6e533bd94a180))
  - 🎸 Added asset loader ([7553bc3](https://github.com/seznam/ima/commit/7553bc36ec420793f6edcdeaff098efab4bd9410))
  - 🎸 Added babel-loader build caching ([22ceed0](https://github.com/seznam/ima/commit/22ceed0497cf1ebdfa9b40924ab461973220be25))
  - 🎸 Added basic error-overlay package ([0c60227](https://github.com/seznam/ima/commit/0c602279e28dcee7d85d3beb230a208186f359e0))
  - 🎸 Added basic fast-refresh error-overlay interop ([6249ce9](https://github.com/seznam/ima/commit/6249ce98e89c7d5b6033e4ee5863614dd7c4f152))
  - 🎸 Added caching option to the scramble css plugin" ([dfa9756](https://github.com/seznam/ima/commit/dfa97560e5cf52b4789bb2095deeab99ba9196b2))
  - 🎸 Added clean webpack plugin ([31fdcd8](https://github.com/seznam/ima/commit/31fdcd892a1d7cc2e805042790c8f1a48fa39f67))
  - 🎸 Added dev server public, port and hostname options ([c68d150](https://github.com/seznam/ima/commit/c68d150eb7a69df8658dd04588aa622b0f696e76))
  - 🎸 Added ErrorBoundary and fixed HMR error reporting ([81ae9cd](https://github.com/seznam/ima/commit/81ae9cd90a775a1d22350dcd5f07677e8127ae87))
  - 🎸 Added esVersion override to dev script ([c4339b6](https://github.com/seznam/ima/commit/c4339b636c5078a60efebbfef17e7585f91f26da))
  - 🎸 Added evalSourceMapMiddleware ([15cb546](https://github.com/seznam/ima/commit/15cb546c094fe50d6927f1cecd08e077c09877cc))
  - 🎸 Added experimental ima and fast refresh overlay clients ([fc7d7e1](https://github.com/seznam/ima/commit/fc7d7e1f7ad21b637df7b30c9a5067a6a920848d))
  - 🎸 Added experimental pluginLoader ([e03005f](https://github.com/seznam/ima/commit/e03005f2550d38477f839794128dd9712917993d))
  - 🎸 Added experimental swc loader configuration ([7ae55d1](https://github.com/seznam/ima/commit/7ae55d108323d7aed2053c02256a1f9df7768a99))
  - 🎸 Added forceSPA flag to ima dev script ([adbdb70](https://github.com/seznam/ima/commit/adbdb707bc44ace0857f620da6b884ef2b2f718e))
  - 🎸 Added globs support for less/css [@imports](https://github.com/imports) ([96b579c](https://github.com/seznam/ima/commit/96b579cabadb6f57f2fff11b295eacea1a9c09c2))
  - 🎸 Added HMR state indicator ([7d14a90](https://github.com/seznam/ima/commit/7d14a907067d892a6e82f672ab3f0f18d49334e1))
  - 🎸 Added ima-legacy-plugin-loader ([2421f08](https://github.com/seznam/ima/commit/2421f08f5ed806f38597a5d9a094b2369eeac282))
  - 🎸 Added multiple compression options ([f31039b](https://github.com/seznam/ima/commit/f31039bbc4d663f434cb4f5b7d0d196d0dac00c2))
  - 🎸 Added new @ima/dev-utils package ([77859dd](https://github.com/seznam/ima/commit/77859dd03b31ce948167b615a13416e69258d822))
  - 🎸 Added new pluginLoader utility class ([636651d](https://github.com/seznam/ima/commit/636651debd3cf936fb286a4f76a070f1cfcd2c5b))
  - 🎸 Added new server 'dev' logger ([f928862](https://github.com/seznam/ima/commit/f92886247ab10cc64893ee40e0e9129324cde3c5))
  - 🎸 Added NODE_ENV normalization on CLI startup ([82df2fc](https://github.com/seznam/ima/commit/82df2fcf51e201ef36b95052cb01054b4aa398a7))
  - 🎸 Added nodemon for server-side changes reloading ([e2e55e8](https://github.com/seznam/ima/commit/e2e55e8df611f36b0f3c808aeaac49e950f48a70))
  - 🎸 Added option to open browser window on ima dev ([d4f595f](https://github.com/seznam/ima/commit/d4f595f8212c22bab66b4d9f29e4a5aab0b9a1b6))
  - 🎸 Added option to set jsxRuntime to ima.config.js ([b0e8a44](https://github.com/seznam/ima/commit/b0e8a44845b40ccc68bbbc08991417c87b2873de))
  - 🎸 Added package @ima/cli ([35e3b5f](https://github.com/seznam/ima/commit/35e3b5faee3c8553d319b54d3ffbca904efe071b))
  - 🎸 added postcss-loader ([d2a7bc4](https://github.com/seznam/ima/commit/d2a7bc48683afdfa7c52cafe0dd83af9b3911d3b))
  - 🎸 Added profile option to production build ([ff6baf6](https://github.com/seznam/ima/commit/ff6baf66f38219c539a7d6c2b55c37abfaf6fe78))
  - 🎸 Added progress plugin to indicate built progress ([7decf8f](https://github.com/seznam/ima/commit/7decf8fe58bf52f318329c44b1575068c9e8a6cc))
  - 🎸 Added raw loaders ([4ff3dd8](https://github.com/seznam/ima/commit/4ff3dd811f6129e69c3ec4969b7c034cee403bef))
  - 🎸 Added reconnecting functionality to hmr client ([41dfd3d](https://github.com/seznam/ima/commit/41dfd3d90a46779e8c1a95c6add394ec1e2f2253))
  - 🎸 Added stack frame mapping to original source ([58d0be7](https://github.com/seznam/ima/commit/58d0be70cc63de92075cdd30e693f5af7d4cb89a))
  - 🎸 Added support for .css files ([a463daa](https://github.com/seznam/ima/commit/a463daa65201c66cedb902a50f65211480f55f3e))
  - 🎸 Added support for custom polyfills ([6837076](https://github.com/seznam/ima/commit/6837076ffcd20ae6cda3e6faa434815d2eca73cc))
  - 🎸 Added support for ima/cli plugins ([a0fd57a](https://github.com/seznam/ima/commit/a0fd57a4d402658117f2053493fd2aa6c00be0eb))
  - 🎸 Added support for react fast refresh ([d41363b](https://github.com/seznam/ima/commit/d41363b177098656fb2bbee671e90527e5c0c048))
  - 🎸 Added support for svgs ([97c18d4](https://github.com/seznam/ima/commit/97c18d423e590c2964ce4906502f6df1e4c22ce8))
  - 🎸 allow defined ima aliases starting with $ from plugin ([f8cb535](https://github.com/seznam/ima/commit/f8cb5357bcf032cf144ecb76c9bc6182c71c5574))
  - 🎸 Allow to build app in development mode ([0c45896](https://github.com/seznam/ima/commit/0c45896bbf6aaf905ea29dd90767a60bdafc7d40))
  - 🎸 AmpCliPlugin ([fb7c50f](https://github.com/seznam/ima/commit/fb7c50fc8721eb23b86e022a0371202301d667d4))
  - 🎸 Automatic react runtime ([66ef765](https://github.com/seznam/ima/commit/66ef765ce095474ef9f50c4207fb6bca23096993))
  - 🎸 babel-loader cache, clean option for CLI commands ([c19147b](https://github.com/seznam/ima/commit/c19147b14a21a2493fbe9635cff9c49a70d50517))
  - 🎸 Basic support for compile errors ([b8796d2](https://github.com/seznam/ima/commit/b8796d2bfcbc510cefdb9818d6aa3d4e845cc8fa))
  - 🎸 batch page state with transactions during loading phase ([8ca6680](https://github.com/seznam/ima/commit/8ca6680c67d0f88b4e57a19b3e97733e8de6922a))
  - 🎸 Better cache busting in default create-ima-app template ([ff2276f](https://github.com/seznam/ima/commit/ff2276fac6d970288ad973ad9c898fddc4243373))
  - 🎸 Better server init app errors handling ([7e9b28b](https://github.com/seznam/ima/commit/7e9b28b28ced86b8d59168a854c81b395a1f8f6d))
  - 🎸 Bundle performance, bundle splitting in dev ([c875ae9](https://github.com/seznam/ima/commit/c875ae9b79a5cadef98cd9625cd200fb55defe4f))
  - 🎸 CacheIdentifier for babel-loader ([4648362](https://github.com/seznam/ima/commit/4648362a4692bd52bd200509403b38d3ec54c17f))
  - 🎸 CLI now prints info about loaded plugins ([ff8405e](https://github.com/seznam/ima/commit/ff8405e9a69a3b0cf901b0b5d4f5b1d492e381e4))
  - 🎸 Compile error message formatter ([b571f2c](https://github.com/seznam/ima/commit/b571f2cfdb397436ce5e9d29a5f6f396af88cd69))
  - 🎸 CSS modules fix on server build ([e98eb21](https://github.com/seznam/ima/commit/e98eb218aecf54c187a0abaab918b5fbcf1035a7))
  - 🎸 Custom extend-less-loader (glob imports support) ([e01514c](https://github.com/seznam/ima/commit/e01514ced577b9fc18a0924e202f78c0d178da0b))
  - 🎸 Depply merge watch options defaults ([bd8d07a](https://github.com/seznam/ima/commit/bd8d07ab0a5e5030f7cdcf31718b3578acd7c321))
  - 🎸 Disabled infrastructure logging in normal mode ([8621f98](https://github.com/seznam/ima/commit/8621f98bf81fb4fb750d7b2c67b7c4c660057d60))
  - 🎸 Error overlay UI improvements ([1bc01f8](https://github.com/seznam/ima/commit/1bc01f8c7e664db790bcde1efa6f24fe95f312a0))
  - 🎸 Final fixes for amp and scramble plugin ([3eb346d](https://github.com/seznam/ima/commit/3eb346dfeee11395db8b112d5aac4c293a5bb653))
  - 🎸 Hello example with init webpack build ([7bc7d68](https://github.com/seznam/ima/commit/7bc7d6870978fee9f776020cf52c86947b62a799))
  - 🎸 Hidden swcMinimizer behind experimental flag ([16a68ac](https://github.com/seznam/ima/commit/16a68accbf5394658bf385020168f06f6d4fd0d5))
  - 🎸 HMR now reloads window after reconnect ([c59f100](https://github.com/seznam/ima/commit/c59f10050f599c70b0659abe3e3b7c96c0287ca9))
  - 🎸 init Localize feature implementation ([daac90a](https://github.com/seznam/ima/commit/daac90acf4040b72f0ad3ec13fb1405b46d4497e))
  - 🎸 Initial support for multiple es versions ([a8a1439](https://github.com/seznam/ima/commit/a8a143956feadee428cc32146e8a7711df3efef3))
  - 🎸 Initial version of LessConstantsPlugin ([3f48ae0](https://github.com/seznam/ima/commit/3f48ae0d00f389f73ad422a5689cc66b639ab6e1))
  - 🎸 Load wasm from local static files ([8741f36](https://github.com/seznam/ima/commit/8741f3667809f1cc6b2aefc10c19b04d9bdf5185))
  - 🎸 Migrated from chalk to picocolors ([af67e8a](https://github.com/seznam/ima/commit/af67e8a4862603414b29f10d0e69a5216516dfe4))
  - 🎸 Moved error-overlay feature behind $Debug flag ([f42d290](https://github.com/seznam/ima/commit/f42d290ec07c760af45ba8d071b40b5364c67cd4))
  - 🎸 Moved to native webpack CSS ([f7f9a59](https://github.com/seznam/ima/commit/f7f9a59c21f309c13a21a984122a39ea06e868e1))
  - 🎸 New logger for plugins ([2cf6062](https://github.com/seznam/ima/commit/2cf6062851f65c0872b45d90111e6a3b47067d77))
  - 🎸 New stack-trace parser, moved all parsing to overlay ([a4ceef5](https://github.com/seznam/ima/commit/a4ceef54664bee6f1d075f2f2e16b0ea676946fe))
  - 🎸 New stats output formatter, hidden performance hint ([3df34ca](https://github.com/seznam/ima/commit/3df34ca746ac2d66a30072c5a3804d11037b84da))
  - 🎸 Performance improvements, fixed parsing of source maps ([f13f718](https://github.com/seznam/ima/commit/f13f7186bb056251d9f040d88a45aff103e5eaa5))
  - 🎸 Promisified fs operations ([033bbe4](https://github.com/seznam/ima/commit/033bbe4ba6fb9ef83bce34df69be180a0e30ec15))
  - 🎸 Remove vendorLinker, imaLoader and imaRunner ([7785612](https://github.com/seznam/ima/commit/7785612dff7a27005cacca26a2bb228ba520745a))
  - 🎸 Replace imaLoader for app/main by refactored appFactory ([3297b7b](https://github.com/seznam/ima/commit/3297b7b294b0dc237fc11f64c8606480b9152b92))
  - 🎸 Replaced fast-glob with globby (more features) ([bce3e06](https://github.com/seznam/ima/commit/bce3e069084ef8297b29c9351918b6ab2b428612))
  - 🎸 Rewritten @ima/cli to use typescript ([d0b6ad4](https://github.com/seznam/ima/commit/d0b6ad45df4c8307c3e488abb6db374443fbd59e))
  - 🎸 Server-side console compile error reporting ([1a5d988](https://github.com/seznam/ima/commit/1a5d98808e263f271d4b15fcda69a81beea55f0b))
  - 🎸 Show localization in example ([5f8976a](https://github.com/seznam/ima/commit/5f8976a79f03d169ca8725acfbc0eeb306581658))
  - 🎸 source-maps, global variables ([597ec8c](https://github.com/seznam/ima/commit/597ec8c93d5f0d8d5434529e25f835b628bc65cf))
  - 🎸 SSR error page is now reloaded upon rebuild ([cecd001](https://github.com/seznam/ima/commit/cecd0010df337ca0343902503c76d0434fc351e9))
  - 🎸 The error overlay iframe can now be closed ([e2c7532](https://github.com/seznam/ima/commit/e2c75320ecd63f136f957766fa748dcc72174139))
  - 🎸 UI Enhancements ([d77ed38](https://github.com/seznam/ima/commit/d77ed3823aef6bdae75256499659a390b1a04cb0))
  - 🎸 UI optimizations ([a059078](https://github.com/seznam/ima/commit/a059078ba3dbd07310d4e4ed8481ff48ad523d41))
  - 🎸 UI, HMR, Compile error handling improvements ([96d49fb](https://github.com/seznam/ima/commit/96d49fb04fd06b58459add7427d59f0fd007bbbb))
  - 🎸 Updated dependencies ([a745b4c](https://github.com/seznam/ima/commit/a745b4c07cd0b1a1029fcca52c7419f8f5c9c221))
  - 🎸 Updated error-overlay visuals ([62f436d](https://github.com/seznam/ima/commit/62f436d0c0cd04fbe8689c60383af2a35d7a9d76))
  - 🎸 Updated Hello(empty) template ([32eb318](https://github.com/seznam/ima/commit/32eb3185ab9c65d110f0388cf32a82fa3f510c8d))
  - 🎸 Updated verdacio ([f0cdbbe](https://github.com/seznam/ima/commit/f0cdbbe65ae523c74e3ddaad655dc0c0a689413a))
  - 🎸 Using esbuild minifiers for faster build ([3a2107c](https://github.com/seznam/ima/commit/3a2107c87826e8dfce194c9f5174e4b1b7ff782a))
  - 🎸 WebpackManifestPlugin, es5 hot reload ([d8e1f85](https://github.com/seznam/ima/commit/d8e1f853fc666867c82676ff72497cc84fffa666))

  ### Performance Improvements

  - ⚡️ Usebuiltins for react build ([ad9a456](https://github.com/seznam/ima/commit/ad9a45624e08bf0c8360a53587b247ba8cdac215))
  - ⚡️ improved watch and build performance ([cf7ff71](https://github.com/seznam/ima/commit/cf7ff71da8fc227c474fa629bb1f4698811ad6f9))
  - ⚡️ Added opt-in enableCssModules option to enable CSSmod ([c56c5f2](https://github.com/seznam/ima/commit/c56c5f2533674133ee717338b34f569150e0415a))
  - ⚡️ batch mode keep one free frame between commits ([3be83b3](https://github.com/seznam/ima/commit/3be83b325a907c4e5bb0d944786fece15460c370))
  - ⚡️ devServer gzipped and cached static serving ([c65b4ef](https://github.com/seznam/ima/commit/c65b4efe1c223b71860b71bd0bf65afc8a1343df))
  - ⚡️ Multiple performance tweaks ([e76234c](https://github.com/seznam/ima/commit/e76234c2ab66e0aaa352cafcc56d83c50eccbbac))
  - ⚡️ Performance improvements, improved IE11 support ([7d40449](https://github.com/seznam/ima/commit/7d40449c55ac10f3c4b19c3f9108e0465a8f8a46))
  - ⚡️ Performance optimizations ([2fe8fd6](https://github.com/seznam/ima/commit/2fe8fd69c917da1ef244af64a5d813055fd5fcc0))
  - ⚡️ Performance optimizations ([361c546](https://github.com/seznam/ima/commit/361c546151ccb434252f5f681722218bdfb6ec50))
  - ⚡️ Removed source-map-loader ([39050ee](https://github.com/seznam/ima/commit/39050ee826b7762b2fea719f87faef52a0de2941))
  - ⚡️ Source map optimizations ([ceef138](https://github.com/seznam/ima/commit/ceef138d4c3918c277301bb78aeaa39e9db50da1))
  - ⚡️ Target optimizations ([e53bc6b](https://github.com/seznam/ima/commit/e53bc6b848d51110e9c06f53bf2812357cfaba84))
  - ⚡️ Target, caching improvements ([756ed12](https://github.com/seznam/ima/commit/756ed12060b2cb83285bae8aa7859b8949cf5c84))
  - ⚡️ watching and devserver are now initialzed in parallel ([a318cf2](https://github.com/seznam/ima/commit/a318cf2449345390f4cb0079e9218038b4e618d6))

  ### BREAKING CHANGES

  - 🧨 HttpAgent feature internalCacheOfPromise returns cloned response
  - 🧨 Resolved promises from load method are set to view in batches

- 91c4c409: allow emitter event to be defaultPrevented

### Minor Changes

- 91c4c409: Add SPA template to `create-ima-app` and update `DocumentView`. Add support for new inject aliases `#{$Scripts}`, `#{$RevivalSettings}`, `#{$Runner}` and `#{$RevivalCache}` to template.

### Patch Changes

- 91c4c409: catching error thrown during handling error from IMA app which will lead to rendering static error page
- 91c4c409: Dependency bump and cleanup
- 91c4c409: The status, send, setPageState and isResponseSent methods removed from $Response class. The $Router.redirect method throw internal redirect errors. Returns value from server.requestHandlerMiddleware has new page property with state, cache, cookie and headers.
- 91c4c409: Fix not set \$Language for dev environment
- 91c4c409: Error cause is propagated to response.
- 91c4c409: Allow configuration path for SPA, 400 and 500 static files. Add new performance monitoring with degradation settings.
- 91c4c409: Fix render before hydration completed.
- 91c4c409: Moved runner.js output to build/server directory
- 91c4c409: Added support for custom publicPath for memStaticProxy
- 91c4c409: re-release
- 91c4c409: Show ErrorOverlay devServerError only in watch mode
- 91c4c409: Menifest resource processing overhaul
- 91c4c409: NotFound Controller can throw redirection error on server.
- 91c4c409: not require ima app for serving only SPA
- 91c4c409: Updated jest to v29
- 91c4c409: Fixed issue with delete require.cache caching, which could resolve in problems where app.server.js file is not reloaded when vendors change.
  Runner is now reloaded form filesystem on every refresh in watch mode, this resolves issue where you get OLD SSR version of the application during development upon refresh.
- 91c4c409: Added args to control lazy init of server app factory in dev mode
- 91c4c409: Injected <script> tags are now identified by unique ids
- 91c4c409: Added new global env IMA_CLI_WATCH indicating dev command run
  Server no longer deletes require cache during refresh in dev environments, rather this functionality is now connected to IMA_CLI_WATCH variable. This means that it only happens during local watch development.
- 91c4c409: context.app is instance of ima App or undefined for static mode
- 91c4c409: Added ability to force runner to load legacy code
- 91c4c409: clear require.cache only for changed files
- 91c4c409: Added memStaticProxy middleware for mem dev serving of static files
- 91c4c409: fix build
- 91c4c409: Added ManifestPlugin, that generates manifest.json files containing map to sources which should be injected to web app upon load.
  $Source definition is no longer defined, it is generated automatically using generated manifest.json file. This can still be customized using custom definition of $Source function.
  Added support for content hashes
- 91c4c409: Improved and simplified error parsing in console and error overlay
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
  - @ima/dev-utils@18.0.0
  - @ima/helpers@18.0.0

## 18.0.0-rc.29

### Patch Changes

- 1108d491: NotFound Controller can throw redirection error on server.

## 18.0.0-rc.28

### Patch Changes

- f0adad35: Allow configuration path for SPA, 400 and 500 static files. Add new performance monitoring with degradation settings.

## 18.0.0-rc.27

### Patch Changes

- 2e3585cd: Error cause is propagated to response.

## 18.0.0-rc.26

### Patch Changes

- c9be9139: catching error thrown during handling error from IMA app which will lead to rendering static error page

## 18.0.0-rc.25

### Patch Changes

- 9e493421: context.app is instance of ima App or undefined for static mode

## 18.0.0-rc.24

### Patch Changes

- d43ffa4a: Menifest resource processing overhaul

## 18.0.0-rc.23

### Patch Changes

- d9227145: Added ManifestPlugin, that generates manifest.json files containing map to sources which should be injected to web app upon load.
  $Source definition is no longer defined, it is generated automatically using generated manifest.json file. This can still be customized using custom definition of $Source function.
  Added support for content hashes

## 18.0.0-rc.22

### Patch Changes

- 80d5a701: Injected <script> tags are now identified by unique ids

## 18.0.0-rc.21

### Patch Changes

- 4e9d899c: Added args to control lazy init of server app factory in dev mode

## 18.0.0-rc.20

### Patch Changes

- 05d36962: Added support for custom publicPath for memStaticProxy

## 18.0.0-rc.19

### Patch Changes

- 0daa7f60: not require ima app for serving only SPA
- 468ad70d: Fixed issue with delete require.cache caching, which could resolve in problems where app.server.js file is not reloaded when vendors change.
  Runner is now reloaded form filesystem on every refresh in watch mode, this resolves issue where you get OLD SSR version of the application during development upon refresh.
- 38ee2e12: Added ability to force runner to load legacy code
- 6005049f: Added memStaticProxy middleware for mem dev serving of static files
- Updated dependencies [468ad70d]
- Updated dependencies [468ad70d]
  - @ima/dev-utils@18.0.0-rc.13

## 18.0.0-rc.18

### Patch Changes

- acd9de23: Fix not set \$Language for dev environment
- a2d9f825: Moved runner.js output to build/server directory
- f52ba908: Show ErrorOverlay devServerError only in watch mode
- 162e08f2: clear require.cache only for changed files

## 18.0.0-rc.17

### Patch Changes

- a34b793e: Dependency bump and cleanup
- Updated dependencies [a34b793e]
  - @ima/dev-utils@18.0.0-rc.12
  - @ima/helpers@18.0.0-rc.7

## 18.0.0-rc.16

### Patch Changes

- 1b77b104: Added new global env IMA_CLI_WATCH indicating dev command run
  Server no longer deletes require cache during refresh in dev environments, rather this functionality is now connected to IMA_CLI_WATCH variable. This means that it only happens during local watch development.

## 18.0.0-rc.15

### Patch Changes

- 0a2c8866: Fix render before hydration completed.
- Updated dependencies [0a2c8866]
  - @ima/dev-utils@18.0.0-rc.11
  - @ima/helpers@18.0.0-rc.6

## 18.0.0-rc.14

### Patch Changes

- 956b8685: Improved and simplified error parsing in console and error overlay
- Updated dependencies [956b8685]
  - @ima/dev-utils@18.0.0-rc.10

## 18.0.0-rc.13

### Patch Changes

- f9c7cd82: Response class refactor

## 18.0.0-rc.12

### Patch Changes

- Updated dependencies [0016d7ff]
  - @ima/dev-utils@18.0.0-rc.9

## 18.0.0-rc.11

### Minor Changes

- af6492c9: Add SPA template to `create-ima-app` and update `DocumentView`. Add support for new inject aliases `#{$Scripts}`, `#{$RevivalSettings}`, `#{$Runner}` and `#{$RevivalCache}` to template.

### Patch Changes

- Updated dependencies [4046f8b1]
- Updated dependencies [af6492c9]
  - @ima/helpers@18.0.0-rc.5

## 18.0.0-rc.10

### Patch Changes

- 71986a9d: re-release

## 18.0.0-rc.9

### Major Changes

- eda23a09: allow emitter event to be defaultPrevented

## 18.0.0-rc.8

### Patch Changes

- Updated dependencies [0760ebb4]
  - @ima/dev-utils@18.0.0-rc.8

## 18.0.0-rc.7

### Patch Changes

- Updated dependencies [49445893]
  - @ima/dev-utils@18.0.0-rc.7

## 18.0.0-rc.6

### Patch Changes

- ce988367: fix build
- Updated dependencies [ce988367]
  - @ima/dev-utils@18.0.0-rc.6
  - @ima/helpers@18.0.0-rc.4

## 18.0.0-rc.5

### Patch Changes

- a2709cb0: Updated jest to v29
- Updated dependencies [a2709cb0]
- Updated dependencies [486e2cde]
  - @ima/dev-utils@18.0.0-rc.5
  - @ima/helpers@18.0.0-rc.3

## 18.0.0-rc.4

### Major Changes

- 7b003ac1: ### Bug Fixes

  - 🐛 crash watch mode after server crashed ([ca798bf](https://github.com/seznam/ima/commit/ca798bf8d971fff654faf1bc1426b3bfbfa71519))
  - 🐛 Fixed broken build ([e070f36](https://github.com/seznam/ima/commit/e070f36aec7a347237eb9d20092d3a8bb3faaad5))
  - 🐛 Fixed lint hangup on docs pkg ([0104200](https://github.com/seznam/ima/commit/0104200678b3ac8d84247465a95dfc892a3185ea))
  - 🐛 Fixed critical bug in compilation of vendors ([26494ce](https://github.com/seznam/ima/commit/26494ce9539fb9882c48ea80b47d48b5f0befeb8))
  - 🐛 hotfix error overlay runtime error parsing ([947ed6c](https://github.com/seznam/ima/commit/947ed6c52003d7a8e91831a414bd84f9bda13a2c))
  - 🐛 Improved error reporting to error-overlay ([7eeb707](https://github.com/seznam/ima/commit/7eeb7078061992ef809ac3c45cd5386e1cc780f6))
  - 🐛 Replaced source-map with source-map-js ([#218](https://github.com/seznam/ima/issues/218)) ([f201896](https://github.com/seznam/ima/commit/f20189683eae9874b7c2ae1b1d3544d0636a4dcc))
  - 🐛 Removed rogue console.log ([8fa0c5b](https://github.com/seznam/ima/commit/8fa0c5b960b5936cc557748fe325afb15a06d243))
  - 🐛 Fixed issue with displaying compile errors in overlay ([#210](https://github.com/seznam/ima/issues/210)) ([0e8ba96](https://github.com/seznam/ima/commit/0e8ba9697f8f0ac1cca223766e858e5d8ba5fff8))
  - 🐛 Fixed PostCSS webpack plugins source maps handling ([#209](https://github.com/seznam/ima/issues/209)) ([fe6af03](https://github.com/seznam/ima/commit/fe6af038f091b6929af872ecae4afe7f5e84d78e))
  - 🐛 Added misssing template dependency ([e05d835](https://github.com/seznam/ima/commit/e05d83593e153c90e77080d8c5a36765f245553c))
  - 🐛 Added uknown error filter to hmr client ([38a5929](https://github.com/seznam/ima/commit/38a5929bb2b5fed457b3d486f15f44fe91f0cbae))
  - 🐛 AMP and scrambleCSS plugins bugfixes ([2eec6c3](https://github.com/seznam/ima/commit/2eec6c3bca22a48ade6a171e5b863b825063ab62))
  - 🐛 babel parser fixes, fixed new compile format err parsing ([63db8e7](https://github.com/seznam/ima/commit/63db8e711f27dd31163db301324ad1cf835e320c))
  - 🐛 Benchmark fix ([7743870](https://github.com/seznam/ima/commit/774387046fdf54f1460c94d4b87d259a1d8dbfd8))
  - 🐛 Better error handling in compiler, overlay and hmr ([ce101e3](https://github.com/seznam/ima/commit/ce101e37557e3929b287c50c734c6ab46cec57cb))
  - 🐛 Clone HttpAgent internalCacheOfPromise result ([57aa831](https://github.com/seznam/ima/commit/57aa83166edd7b8d4b54e01c6f8e3dd084273fd5))
  - 🐛 Correct npm registry in package-lock ([578881d](https://github.com/seznam/ima/commit/578881df74807be320e045d8b38b095745f32309))
  - 🐛 css modules build fixes ([7e95183](https://github.com/seznam/ima/commit/7e951835d828c348514fba7096598797c86ac2d7))
  - 🐛 Dev logger fixes ([dd93463](https://github.com/seznam/ima/commit/dd9346389da3f2f580ffaad1c344ec9911512b1f))
  - 🐛 error-overlay and runtime error reporting fixes ([07b9d29](https://github.com/seznam/ima/commit/07b9d2972d7e90c6f8ef943e8f721841e0006882))
  - 🐛 Fix dependency to build.js in urlParser ([604d05a](https://github.com/seznam/ima/commit/604d05a4d8d9d06ecd3ad41640c145e5e7c51e83))
  - 🐛 Fix HMR disconnect on controller error ([3554457](https://github.com/seznam/ima/commit/35544577ca01b2d437bd936efff358cda4cdb987))
  - 🐛 Fix ignoring less files when CSSModules are disabled ([590050d](https://github.com/seznam/ima/commit/590050dbff65da709dc88be0413ea4b569000976))
  - 🐛 Fix localize from hook ([28c3f50](https://github.com/seznam/ima/commit/28c3f5080f210ac8f7270e2cea262aca9ea039a3))
  - 🐛 Fix peer deps in benchmark ([8e94e8f](https://github.com/seznam/ima/commit/8e94e8f82eb45f5474c42ffcfe9bababc4ccb6dc))
  - 🐛 Fixed broken types in CLI package ([bc5a73e](https://github.com/seznam/ima/commit/bc5a73e98120a1a09676a91e475f7cbf54e4c64d))
  - 🐛 fixed build ([107ac2d](https://github.com/seznam/ima/commit/107ac2d32be00128d836276050693b2332305712))
  - 🐛 Fixed compile error parsing ([e9013a3](https://github.com/seznam/ima/commit/e9013a3e1ab020f31621d059a91027ef7b671877))
  - 🐛 fixed dev task ([a25466c](https://github.com/seznam/ima/commit/a25466c89267f171a9c5abec549e8c55d090f2c7))
  - 🐛 Fixed doubling of runtime errors ([2c7cbab](https://github.com/seznam/ima/commit/2c7cbab8fbbc53b874c2bfcfc68537103f529aef))
  - 🐛 Fixed error when there are no localizations ([31a9655](https://github.com/seznam/ima/commit/31a96554831d151dbddc7d5864a504ca69d53b1c))
  - 🐛 Fixed error-overlay view compiled btn text wrapping ([0ca3f1c](https://github.com/seznam/ima/commit/0ca3f1cac96b66ec1aaa2d012a63796559f9ad55))
  - 🐛 Fixed eval-source-map middleware runtime error parsing ([721469d](https://github.com/seznam/ima/commit/721469d8500c62537d833bc1ebb228c905a8ebd7))
  - 🐛 Fixed fastRefreshInterop events ([342e9e7](https://github.com/seznam/ima/commit/342e9e7d47a87b96c2f28ee08fe1869a58141130))
  - 🐛 Fixed forceSPA mode ([7efffbc](https://github.com/seznam/ima/commit/7efffbc89a1b87f9ee224a26ad045e6d4042b7d8))
  - 🐛 Fixed handleError issues and incorrect dependencies ([bf8f7f6](https://github.com/seznam/ima/commit/bf8f7f628b4a77abff8a89306fbd1adf6bfb863a))
  - 🐛 Fixed hot reload in legacy and forceSPA modes ([19e2ed7](https://github.com/seznam/ima/commit/19e2ed74bcbf5189a88b5b884e89a3ce72111bfb))
  - 🐛 Fixed I11 swc config ([6c6047f](https://github.com/seznam/ima/commit/6c6047f22a8d21d49483aec4dd7a81c6cb928ba7))
  - 🐛 Fixed IMA.js SPA mode ([fbbffa2](https://github.com/seznam/ima/commit/fbbffa2c68557dcf27a9c89e1117bb4c3d543245))
  - 🐛 Fixed incorrect error handling in services.js ([cbdddc8](https://github.com/seznam/ima/commit/cbdddc8d6d4398c3f3f7956cadb8c2900e63911e))
  - 🐛 Fixed lengthy server error processing ([a76f1cc](https://github.com/seznam/ima/commit/a76f1cc291da7e1c927180ee51e5ec44f67f0755))
  - 🐛 Fixed logger overlapping newlines issues ([7682081](https://github.com/seznam/ima/commit/7682081139565987fcb9ed6bd24023e40d9b0aad))
  - 🐛 Fixed nodemon logging before server start ([9347f07](https://github.com/seznam/ima/commit/9347f07bc42db491592efc6502b21273a785e730))
  - 🐛 Fixed occasional duplication of progress bar ([05eed21](https://github.com/seznam/ima/commit/05eed2188a54926ac91ffb6dc1a4f6f0463e359a))
  - 🐛 Fixed package dependencies ([3dbbe1f](https://github.com/seznam/ima/commit/3dbbe1ffc23dcde22c79eac93d3429d3a61208de))
  - 🐛 Fixed PROD env, dev error handling ([8c987ff](https://github.com/seznam/ima/commit/8c987ff37e09884e3de8fff9c87f817291bc2a71))
  - 🐛 Fixed production CSS source maps generation ([d2462ac](https://github.com/seznam/ima/commit/d2462acc40a85286cd8a11f46b2e3cf1a5e8e92c))
  - 🐛 Fixed progress plugin ([2c7fe1a](https://github.com/seznam/ima/commit/2c7fe1ac9fde6da744e70ce32871266a8cf6170a))
  - 🐛 Fixed public path cli override ([b135f4b](https://github.com/seznam/ima/commit/b135f4be413dd42be17dde3d372897bfe976e405))
  - 🐛 fixed relative urls in error overlay ([d528717](https://github.com/seznam/ima/commit/d5287173cbaa7aee0f245ddec330127dc99f0418))
  - 🐛 Fixed reloading of locale files ([2f653d7](https://github.com/seznam/ima/commit/2f653d77d1865b5cb4fb321aeba3593bc1918a70))
  - 🐛 Fixed RunImaPlugin ([e33ae30](https://github.com/seznam/ima/commit/e33ae30ee1907b18571309359940cd6c0c86c1ef))
  - 🐛 Fixed server-side HMR ([19b9a24](https://github.com/seznam/ima/commit/19b9a24f59a1138a9ac767ce78b6d51d50b50dff))
  - 🐛 Fixed server-side runtime errors ([b8512eb](https://github.com/seznam/ima/commit/b8512eb07c788432ea293c5d94d4486bb036b504))
  - 🐛 Fixed SWC error parser ([26c1c78](https://github.com/seznam/ima/commit/26c1c783af2c48ca8e96ed2fdb9aa7c101a2dc9f))
  - 🐛 Fixed webpack build getting stuck with multiple es versi ([f9e2a07](https://github.com/seznam/ima/commit/f9e2a078e838b3b20229f853e8292dbc1c517025))
  - 🐛 HMR fixes ([3b9fafd](https://github.com/seznam/ima/commit/3b9fafd7637edc9ac52131fbd77749a40328dfe3))
  - 🐛 hot module updates static path fixes ([1e98408](https://github.com/seznam/ima/commit/1e984083eaa35e824735624880bda139809c9ed8))
  - 🐛 Location of localized files ([b258e21](https://github.com/seznam/ima/commit/b258e21e3f29cea4f272f9142e4030689c34aa09))
  - 🐛 Minor error reporting fixes ([94a53c8](https://github.com/seznam/ima/commit/94a53c8265312315eaaf912d3c294a2a0ac73a75))
  - 🐛 Minor HMR error handling fixes ([1f15b7d](https://github.com/seznam/ima/commit/1f15b7d005e5aa7d9a572b74fa1b7ce17a8bf5b5))
  - 🐛 Minor source storage cache fixes) ([6a2c7d0](https://github.com/seznam/ima/commit/6a2c7d0ea38804a9451a8ac8fce6053c164fe001))
  - 🐛 Multiple overlay style fixes ([a6437c8](https://github.com/seznam/ima/commit/a6437c84a8547d55edcf5d8836aabfb6dde990d2))
  - 🐛 Plugin dynamic binding fix ([1049c7a](https://github.com/seznam/ima/commit/1049c7aa87671c97555a6e2247a3eed7a6c3d207))
  - 🐛 Quick chunkname fix ([e6856e2](https://github.com/seznam/ima/commit/e6856e2cb8d04811f2b55a800460c6148227296d))
  - 🐛 Re-enabled fast refresh ([1f27c9c](https://github.com/seznam/ima/commit/1f27c9cefc43dcbde6a61d5d82c953331aa160e2))
  - 🐛 React deprecated createFactory fix, added --clearCache ([5939c45](https://github.com/seznam/ima/commit/5939c45d5a5a694255cb401f5abd7ef6843a276f))
  - 🐛 removed gsed in benchmark ([db5862f](https://github.com/seznam/ima/commit/db5862f8b63b9767e696faa6a93552e83eafe59f))
  - 🐛 Removed start script from CLI ([1de9631](https://github.com/seznam/ima/commit/1de96310f19ad7fcf6e981d1394b523e2f3f8bef))
  - 🐛 Removed unneeded server.bundle watching ([7474148](https://github.com/seznam/ima/commit/74741481acc00dbd9eae4a7e74ea9c4c80ec2ca0))
  - 🐛 Removed unused manifest plugin ([ebcfc64](https://github.com/seznam/ima/commit/ebcfc64c27e61c07afc5647a299639c666a4481f))
  - 🐛 Reverted back to using mini-css-extract-plugin by defaul ([c9da2f7](https://github.com/seznam/ima/commit/c9da2f7f41f2d2e264cd4205bf383716947112a3))
  - 🐛 Reverted less-extended-loader usage ([eb03447](https://github.com/seznam/ima/commit/eb03447f689aa4a852c00caf1524ed3f2c52c031))
  - 🐛 Reverted mini-css-extract-plugin, native css is optional ([f00c359](https://github.com/seznam/ima/commit/f00c35909f9a8cb21319d00ce830b1075653afaf))
  - 🐛 Scramble css source map support fix ([9cbe36b](https://github.com/seznam/ima/commit/9cbe36baab15790e34ac96e57a2fe165cd3b8222))
  - 🐛 SWC and babel fixes ([4a872dc](https://github.com/seznam/ima/commit/4a872dc441c4dfdaa151da39e3dcb71f193cc165))
  - 🐛 swc compile error parser ([26f9e75](https://github.com/seznam/ima/commit/26f9e7571228b50dfb76d0b7dd1ec241e4748c3e))
  - 🐛 Track unique errors before logging ([6c0f0cf](https://github.com/seznam/ima/commit/6c0f0cf20763f80b59b12fc15c46e0466323cff4))
  - 🐛 tsconfig fixes ([27d3b56](https://github.com/seznam/ima/commit/27d3b56391697273a236d4b83b4fd96bc47a1b85))
  - 🐛 updated packagelocks ([c3d6ce1](https://github.com/seznam/ima/commit/c3d6ce1f8b4d224673793261f60469f3c840b096))
  - 🐛 Verdacio fix ([c1709ff](https://github.com/seznam/ima/commit/c1709ff1399dc5459cce72bc020de693e8f442bc))
  - 🐛 Verdacio fix take 4 ([24f3607](https://github.com/seznam/ima/commit/24f36071fd57483b538693a076914f9ce3032f75))
  - broken test infrastructure for new create-ima-app apps ([#183](https://github.com/seznam/ima/issues/183)) ([53832c7](https://github.com/seznam/ima/commit/53832c79d83f7ed0532eb82abca1fcee0896a79a))

  ### Code Refactoring

  - 💡 keep same interface for mount and update methods ([fbdd705](https://github.com/seznam/ima/commit/fbdd7056b9ad5599bdc9e7b03ee7d29dbc44ed1f))
  - 💡 remove deprectecated clearState method ([7cab3af](https://github.com/seznam/ima/commit/7cab3af498ee100071ab9bc444683dcade7e9ddf))

  ### Features

  - 🎸 Added option to disable non-es build completely ([f15edee](https://github.com/seznam/ima/commit/f15edee847874e150d2fd44a2c09de34ed4b8058))
  - 🎸 Finished CLI documentation and tweaked CIL plugins ([7ae9395](https://github.com/seznam/ima/commit/7ae9395fc847de25f54931ad755f4a5bf0be6e43))
  - 🎸 Migrated from es5, es11 to es9 and es13 versions ([#237](https://github.com/seznam/ima/issues/237)) ([20b108f](https://github.com/seznam/ima/commit/20b108f7de172fd3c40f8b090e40c8a9f4c7de35))
  - 🎸 Removed babel support (swc is now only supported) ([4f1f708](https://github.com/seznam/ima/commit/4f1f7080555b422a2c661c24ab37316460ed04b2))
  - 🎸 ScrambleCss and AnalyzePlugin tweaks + docs ([e3b1f26](https://github.com/seznam/ima/commit/e3b1f262df3a7b4cc34cab2eb47d3abfbf16438c))
  - 🎸 Improved code splitting and swc config ([226fdf0](https://github.com/seznam/ima/commit/226fdf0b9b93ca9a7c176a7910ab24ff6e4946b0))
  - 🎸 Merge language files instead of overwriting ([3ec8ea7](https://github.com/seznam/ima/commit/3ec8ea7873e7dacc3e50103a60475ab1dea671b2))
  - 🎸 Kill already running app on the same port before launch ([#213](https://github.com/seznam/ima/issues/213)) ([3790164](https://github.com/seznam/ima/commit/3790164bd015f6444943fe76b8dc76d0da6f688d))
  - 🎸 Node 18 native fetch support ([#212](https://github.com/seznam/ima/issues/212)) ([69df0a3](https://github.com/seznam/ima/commit/69df0a3bf334217b051f2cb261adc572f0e5093c))
  - 🎸 Accept array of globs with translations ([3e2ee88](https://github.com/seznam/ima/commit/3e2ee881b201088d908583d02dff4788f138120e))
  - 🎸 Added "Open in editor" button in error overlay ([adf5211](https://github.com/seznam/ima/commit/adf52111dba6825b80d0e6641f82cbd166fdf4e9))
  - 🎸 Added ability to override babel and postcss configs ([aef5ef6](https://github.com/seznam/ima/commit/aef5ef6b8762fd4a415baae4591d736840ed3622))
  - 🎸 Added ability to resolve es and non-es babel config ([84f0070](https://github.com/seznam/ima/commit/84f00706d51c8d610c0c429cb3fb4e7f0b53ad6e))
  - 🎸 Added analyze cli plugin ([f6b5026](https://github.com/seznam/ima/commit/f6b5026f43e7c0765e22e25f10e6e533bd94a180))
  - 🎸 Added asset loader ([7553bc3](https://github.com/seznam/ima/commit/7553bc36ec420793f6edcdeaff098efab4bd9410))
  - 🎸 Added babel-loader build caching ([22ceed0](https://github.com/seznam/ima/commit/22ceed0497cf1ebdfa9b40924ab461973220be25))
  - 🎸 Added basic error-overlay package ([0c60227](https://github.com/seznam/ima/commit/0c602279e28dcee7d85d3beb230a208186f359e0))
  - 🎸 Added basic fast-refresh error-overlay interop ([6249ce9](https://github.com/seznam/ima/commit/6249ce98e89c7d5b6033e4ee5863614dd7c4f152))
  - 🎸 Added caching option to the scramble css plugin" ([dfa9756](https://github.com/seznam/ima/commit/dfa97560e5cf52b4789bb2095deeab99ba9196b2))
  - 🎸 Added clean webpack plugin ([31fdcd8](https://github.com/seznam/ima/commit/31fdcd892a1d7cc2e805042790c8f1a48fa39f67))
  - 🎸 Added dev server public, port and hostname options ([c68d150](https://github.com/seznam/ima/commit/c68d150eb7a69df8658dd04588aa622b0f696e76))
  - 🎸 Added ErrorBoundary and fixed HMR error reporting ([81ae9cd](https://github.com/seznam/ima/commit/81ae9cd90a775a1d22350dcd5f07677e8127ae87))
  - 🎸 Added esVersion override to dev script ([c4339b6](https://github.com/seznam/ima/commit/c4339b636c5078a60efebbfef17e7585f91f26da))
  - 🎸 Added evalSourceMapMiddleware ([15cb546](https://github.com/seznam/ima/commit/15cb546c094fe50d6927f1cecd08e077c09877cc))
  - 🎸 Added experimental ima and fast refresh overlay clients ([fc7d7e1](https://github.com/seznam/ima/commit/fc7d7e1f7ad21b637df7b30c9a5067a6a920848d))
  - 🎸 Added experimental pluginLoader ([e03005f](https://github.com/seznam/ima/commit/e03005f2550d38477f839794128dd9712917993d))
  - 🎸 Added experimental swc loader configuration ([7ae55d1](https://github.com/seznam/ima/commit/7ae55d108323d7aed2053c02256a1f9df7768a99))
  - 🎸 Added forceSPA flag to ima dev script ([adbdb70](https://github.com/seznam/ima/commit/adbdb707bc44ace0857f620da6b884ef2b2f718e))
  - 🎸 Added globs support for less/css [@imports](https://github.com/imports) ([96b579c](https://github.com/seznam/ima/commit/96b579cabadb6f57f2fff11b295eacea1a9c09c2))
  - 🎸 Added HMR state indicator ([7d14a90](https://github.com/seznam/ima/commit/7d14a907067d892a6e82f672ab3f0f18d49334e1))
  - 🎸 Added ima-legacy-plugin-loader ([2421f08](https://github.com/seznam/ima/commit/2421f08f5ed806f38597a5d9a094b2369eeac282))
  - 🎸 Added multiple compression options ([f31039b](https://github.com/seznam/ima/commit/f31039bbc4d663f434cb4f5b7d0d196d0dac00c2))
  - 🎸 Added new @ima/dev-utils package ([77859dd](https://github.com/seznam/ima/commit/77859dd03b31ce948167b615a13416e69258d822))
  - 🎸 Added new pluginLoader utility class ([636651d](https://github.com/seznam/ima/commit/636651debd3cf936fb286a4f76a070f1cfcd2c5b))
  - 🎸 Added new server 'dev' logger ([f928862](https://github.com/seznam/ima/commit/f92886247ab10cc64893ee40e0e9129324cde3c5))
  - 🎸 Added NODE_ENV normalization on CLI startup ([82df2fc](https://github.com/seznam/ima/commit/82df2fcf51e201ef36b95052cb01054b4aa398a7))
  - 🎸 Added nodemon for server-side changes reloading ([e2e55e8](https://github.com/seznam/ima/commit/e2e55e8df611f36b0f3c808aeaac49e950f48a70))
  - 🎸 Added option to open browser window on ima dev ([d4f595f](https://github.com/seznam/ima/commit/d4f595f8212c22bab66b4d9f29e4a5aab0b9a1b6))
  - 🎸 Added option to set jsxRuntime to ima.config.js ([b0e8a44](https://github.com/seznam/ima/commit/b0e8a44845b40ccc68bbbc08991417c87b2873de))
  - 🎸 Added package @ima/cli ([35e3b5f](https://github.com/seznam/ima/commit/35e3b5faee3c8553d319b54d3ffbca904efe071b))
  - 🎸 added postcss-loader ([d2a7bc4](https://github.com/seznam/ima/commit/d2a7bc48683afdfa7c52cafe0dd83af9b3911d3b))
  - 🎸 Added profile option to production build ([ff6baf6](https://github.com/seznam/ima/commit/ff6baf66f38219c539a7d6c2b55c37abfaf6fe78))
  - 🎸 Added progress plugin to indicate built progress ([7decf8f](https://github.com/seznam/ima/commit/7decf8fe58bf52f318329c44b1575068c9e8a6cc))
  - 🎸 Added raw loaders ([4ff3dd8](https://github.com/seznam/ima/commit/4ff3dd811f6129e69c3ec4969b7c034cee403bef))
  - 🎸 Added reconnecting functionality to hmr client ([41dfd3d](https://github.com/seznam/ima/commit/41dfd3d90a46779e8c1a95c6add394ec1e2f2253))
  - 🎸 Added stack frame mapping to original source ([58d0be7](https://github.com/seznam/ima/commit/58d0be70cc63de92075cdd30e693f5af7d4cb89a))
  - 🎸 Added support for .css files ([a463daa](https://github.com/seznam/ima/commit/a463daa65201c66cedb902a50f65211480f55f3e))
  - 🎸 Added support for custom polyfills ([6837076](https://github.com/seznam/ima/commit/6837076ffcd20ae6cda3e6faa434815d2eca73cc))
  - 🎸 Added support for ima/cli plugins ([a0fd57a](https://github.com/seznam/ima/commit/a0fd57a4d402658117f2053493fd2aa6c00be0eb))
  - 🎸 Added support for react fast refresh ([d41363b](https://github.com/seznam/ima/commit/d41363b177098656fb2bbee671e90527e5c0c048))
  - 🎸 Added support for svgs ([97c18d4](https://github.com/seznam/ima/commit/97c18d423e590c2964ce4906502f6df1e4c22ce8))
  - 🎸 allow defined ima aliases starting with \$ from plugin ([f8cb535](https://github.com/seznam/ima/commit/f8cb5357bcf032cf144ecb76c9bc6182c71c5574))
  - 🎸 Allow to build app in development mode ([0c45896](https://github.com/seznam/ima/commit/0c45896bbf6aaf905ea29dd90767a60bdafc7d40))
  - 🎸 AmpCliPlugin ([fb7c50f](https://github.com/seznam/ima/commit/fb7c50fc8721eb23b86e022a0371202301d667d4))
  - 🎸 Automatic react runtime ([66ef765](https://github.com/seznam/ima/commit/66ef765ce095474ef9f50c4207fb6bca23096993))
  - 🎸 babel-loader cache, clean option for CLI commands ([c19147b](https://github.com/seznam/ima/commit/c19147b14a21a2493fbe9635cff9c49a70d50517))
  - 🎸 Basic support for compile errors ([b8796d2](https://github.com/seznam/ima/commit/b8796d2bfcbc510cefdb9818d6aa3d4e845cc8fa))
  - 🎸 batch page state with transactions during loading phase ([8ca6680](https://github.com/seznam/ima/commit/8ca6680c67d0f88b4e57a19b3e97733e8de6922a))
  - 🎸 Better cache busting in default create-ima-app template ([ff2276f](https://github.com/seznam/ima/commit/ff2276fac6d970288ad973ad9c898fddc4243373))
  - 🎸 Better server init app errors handling ([7e9b28b](https://github.com/seznam/ima/commit/7e9b28b28ced86b8d59168a854c81b395a1f8f6d))
  - 🎸 Bundle performance, bundle splitting in dev ([c875ae9](https://github.com/seznam/ima/commit/c875ae9b79a5cadef98cd9625cd200fb55defe4f))
  - 🎸 CacheIdentifier for babel-loader ([4648362](https://github.com/seznam/ima/commit/4648362a4692bd52bd200509403b38d3ec54c17f))
  - 🎸 CLI now prints info about loaded plugins ([ff8405e](https://github.com/seznam/ima/commit/ff8405e9a69a3b0cf901b0b5d4f5b1d492e381e4))
  - 🎸 Compile error message formatter ([b571f2c](https://github.com/seznam/ima/commit/b571f2cfdb397436ce5e9d29a5f6f396af88cd69))
  - 🎸 CSS modules fix on server build ([e98eb21](https://github.com/seznam/ima/commit/e98eb218aecf54c187a0abaab918b5fbcf1035a7))
  - 🎸 Custom extend-less-loader (glob imports support) ([e01514c](https://github.com/seznam/ima/commit/e01514ced577b9fc18a0924e202f78c0d178da0b))
  - 🎸 Depply merge watch options defaults ([bd8d07a](https://github.com/seznam/ima/commit/bd8d07ab0a5e5030f7cdcf31718b3578acd7c321))
  - 🎸 Disabled infrastructure logging in normal mode ([8621f98](https://github.com/seznam/ima/commit/8621f98bf81fb4fb750d7b2c67b7c4c660057d60))
  - 🎸 Error overlay UI improvements ([1bc01f8](https://github.com/seznam/ima/commit/1bc01f8c7e664db790bcde1efa6f24fe95f312a0))
  - 🎸 Final fixes for amp and scramble plugin ([3eb346d](https://github.com/seznam/ima/commit/3eb346dfeee11395db8b112d5aac4c293a5bb653))
  - 🎸 Hello example with init webpack build ([7bc7d68](https://github.com/seznam/ima/commit/7bc7d6870978fee9f776020cf52c86947b62a799))
  - 🎸 Hidden swcMinimizer behind experimental flag ([16a68ac](https://github.com/seznam/ima/commit/16a68accbf5394658bf385020168f06f6d4fd0d5))
  - 🎸 HMR now reloads window after reconnect ([c59f100](https://github.com/seznam/ima/commit/c59f10050f599c70b0659abe3e3b7c96c0287ca9))
  - 🎸 init Localize feature implementation ([daac90a](https://github.com/seznam/ima/commit/daac90acf4040b72f0ad3ec13fb1405b46d4497e))
  - 🎸 Initial support for multiple es versions ([a8a1439](https://github.com/seznam/ima/commit/a8a143956feadee428cc32146e8a7711df3efef3))
  - 🎸 Initial version of LessConstantsPlugin ([3f48ae0](https://github.com/seznam/ima/commit/3f48ae0d00f389f73ad422a5689cc66b639ab6e1))
  - 🎸 Load wasm from local static files ([8741f36](https://github.com/seznam/ima/commit/8741f3667809f1cc6b2aefc10c19b04d9bdf5185))
  - 🎸 Migrated from chalk to picocolors ([af67e8a](https://github.com/seznam/ima/commit/af67e8a4862603414b29f10d0e69a5216516dfe4))
  - 🎸 Moved error-overlay feature behind \$Debug flag ([f42d290](https://github.com/seznam/ima/commit/f42d290ec07c760af45ba8d071b40b5364c67cd4))
  - 🎸 Moved to native webpack CSS ([f7f9a59](https://github.com/seznam/ima/commit/f7f9a59c21f309c13a21a984122a39ea06e868e1))
  - 🎸 New logger for plugins ([2cf6062](https://github.com/seznam/ima/commit/2cf6062851f65c0872b45d90111e6a3b47067d77))
  - 🎸 New stack-trace parser, moved all parsing to overlay ([a4ceef5](https://github.com/seznam/ima/commit/a4ceef54664bee6f1d075f2f2e16b0ea676946fe))
  - 🎸 New stats output formatter, hidden performance hint ([3df34ca](https://github.com/seznam/ima/commit/3df34ca746ac2d66a30072c5a3804d11037b84da))
  - 🎸 Performance improvements, fixed parsing of source maps ([f13f718](https://github.com/seznam/ima/commit/f13f7186bb056251d9f040d88a45aff103e5eaa5))
  - 🎸 Promisified fs operations ([033bbe4](https://github.com/seznam/ima/commit/033bbe4ba6fb9ef83bce34df69be180a0e30ec15))
  - 🎸 Remove vendorLinker, imaLoader and imaRunner ([7785612](https://github.com/seznam/ima/commit/7785612dff7a27005cacca26a2bb228ba520745a))
  - 🎸 Replace imaLoader for app/main by refactored appFactory ([3297b7b](https://github.com/seznam/ima/commit/3297b7b294b0dc237fc11f64c8606480b9152b92))
  - 🎸 Replaced fast-glob with globby (more features) ([bce3e06](https://github.com/seznam/ima/commit/bce3e069084ef8297b29c9351918b6ab2b428612))
  - 🎸 Rewritten @ima/cli to use typescript ([d0b6ad4](https://github.com/seznam/ima/commit/d0b6ad45df4c8307c3e488abb6db374443fbd59e))
  - 🎸 Server-side console compile error reporting ([1a5d988](https://github.com/seznam/ima/commit/1a5d98808e263f271d4b15fcda69a81beea55f0b))
  - 🎸 Show localization in example ([5f8976a](https://github.com/seznam/ima/commit/5f8976a79f03d169ca8725acfbc0eeb306581658))
  - 🎸 source-maps, global variables ([597ec8c](https://github.com/seznam/ima/commit/597ec8c93d5f0d8d5434529e25f835b628bc65cf))
  - 🎸 SSR error page is now reloaded upon rebuild ([cecd001](https://github.com/seznam/ima/commit/cecd0010df337ca0343902503c76d0434fc351e9))
  - 🎸 The error overlay iframe can now be closed ([e2c7532](https://github.com/seznam/ima/commit/e2c75320ecd63f136f957766fa748dcc72174139))
  - 🎸 UI Enhancements ([d77ed38](https://github.com/seznam/ima/commit/d77ed3823aef6bdae75256499659a390b1a04cb0))
  - 🎸 UI optimizations ([a059078](https://github.com/seznam/ima/commit/a059078ba3dbd07310d4e4ed8481ff48ad523d41))
  - 🎸 UI, HMR, Compile error handling improvements ([96d49fb](https://github.com/seznam/ima/commit/96d49fb04fd06b58459add7427d59f0fd007bbbb))
  - 🎸 Updated dependencies ([a745b4c](https://github.com/seznam/ima/commit/a745b4c07cd0b1a1029fcca52c7419f8f5c9c221))
  - 🎸 Updated error-overlay visuals ([62f436d](https://github.com/seznam/ima/commit/62f436d0c0cd04fbe8689c60383af2a35d7a9d76))
  - 🎸 Updated Hello(empty) template ([32eb318](https://github.com/seznam/ima/commit/32eb3185ab9c65d110f0388cf32a82fa3f510c8d))
  - 🎸 Updated verdacio ([f0cdbbe](https://github.com/seznam/ima/commit/f0cdbbe65ae523c74e3ddaad655dc0c0a689413a))
  - 🎸 Using esbuild minifiers for faster build ([3a2107c](https://github.com/seznam/ima/commit/3a2107c87826e8dfce194c9f5174e4b1b7ff782a))
  - 🎸 WebpackManifestPlugin, es5 hot reload ([d8e1f85](https://github.com/seznam/ima/commit/d8e1f853fc666867c82676ff72497cc84fffa666))

  ### Performance Improvements

  - ⚡️ Usebuiltins for react build ([ad9a456](https://github.com/seznam/ima/commit/ad9a45624e08bf0c8360a53587b247ba8cdac215))
  - ⚡️ improved watch and build performance ([cf7ff71](https://github.com/seznam/ima/commit/cf7ff71da8fc227c474fa629bb1f4698811ad6f9))
  - ⚡️ Added opt-in enableCssModules option to enable CSSmod ([c56c5f2](https://github.com/seznam/ima/commit/c56c5f2533674133ee717338b34f569150e0415a))
  - ⚡️ batch mode keep one free frame between commits ([3be83b3](https://github.com/seznam/ima/commit/3be83b325a907c4e5bb0d944786fece15460c370))
  - ⚡️ devServer gzipped and cached static serving ([c65b4ef](https://github.com/seznam/ima/commit/c65b4efe1c223b71860b71bd0bf65afc8a1343df))
  - ⚡️ Multiple performance tweaks ([e76234c](https://github.com/seznam/ima/commit/e76234c2ab66e0aaa352cafcc56d83c50eccbbac))
  - ⚡️ Performance improvements, improved IE11 support ([7d40449](https://github.com/seznam/ima/commit/7d40449c55ac10f3c4b19c3f9108e0465a8f8a46))
  - ⚡️ Performance optimizations ([2fe8fd6](https://github.com/seznam/ima/commit/2fe8fd69c917da1ef244af64a5d813055fd5fcc0))
  - ⚡️ Performance optimizations ([361c546](https://github.com/seznam/ima/commit/361c546151ccb434252f5f681722218bdfb6ec50))
  - ⚡️ Removed source-map-loader ([39050ee](https://github.com/seznam/ima/commit/39050ee826b7762b2fea719f87faef52a0de2941))
  - ⚡️ Source map optimizations ([ceef138](https://github.com/seznam/ima/commit/ceef138d4c3918c277301bb78aeaa39e9db50da1))
  - ⚡️ Target optimizations ([e53bc6b](https://github.com/seznam/ima/commit/e53bc6b848d51110e9c06f53bf2812357cfaba84))
  - ⚡️ Target, caching improvements ([756ed12](https://github.com/seznam/ima/commit/756ed12060b2cb83285bae8aa7859b8949cf5c84))
  - ⚡️ watching and devserver are now initialzed in parallel ([a318cf2](https://github.com/seznam/ima/commit/a318cf2449345390f4cb0079e9218038b4e618d6))

  ### BREAKING CHANGES

  - 🧨 HttpAgent feature internalCacheOfPromise returns cloned response
  - 🧨 Resolved promises from load method are set to view in batches

### Patch Changes

- Updated dependencies [7b003ac1]
  - @ima/dev-utils@18.0.0-rc.4
  - @ima/helpers@18.0.0-rc.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [18.0.0-rc.3](https://github.com/seznam/ima/compare/v18.0.0-rc.2...v18.0.0-rc.3) (2022-07-14)

**Note:** Version bump only for package @ima/server

# [18.0.0-rc.1](https://github.com/seznam/ima/compare/v18.0.0-rc.0...v18.0.0-rc.1) (2022-06-21)

**Note:** Version bump only for package @ima/server

# [18.0.0-rc.1](https://github.com/seznam/ima/compare/v18.0.0-rc.0...v18.0.0-rc.1) (2022-06-21)

**Note:** Version bump only for package @ima/server

# [18.0.0-rc.0](https://github.com/seznam/ima/compare/v17.12.3...v18.0.0-rc.0) (2022-05-26)

### Bug Fixes

- 🐛 Dev logger fixes ([dd93463](https://github.com/seznam/ima/commit/dd9346389da3f2f580ffaad1c344ec9911512b1f))
- 🐛 Fix dependency to build.js in urlParser ([604d05a](https://github.com/seznam/ima/commit/604d05a4d8d9d06ecd3ad41640c145e5e7c51e83))
- 🐛 Fixed doubling of runtime errors ([2c7cbab](https://github.com/seznam/ima/commit/2c7cbab8fbbc53b874c2bfcfc68537103f529aef))
- 🐛 Fixed handleError issues and incorrect dependencies ([bf8f7f6](https://github.com/seznam/ima/commit/bf8f7f628b4a77abff8a89306fbd1adf6bfb863a))
- 🐛 Fixed IMA.js SPA mode ([fbbffa2](https://github.com/seznam/ima/commit/fbbffa2c68557dcf27a9c89e1117bb4c3d543245))
- 🐛 Fixed lengthy server error processing ([a76f1cc](https://github.com/seznam/ima/commit/a76f1cc291da7e1c927180ee51e5ec44f67f0755))
- 🐛 Fixed PROD env, dev error handling ([8c987ff](https://github.com/seznam/ima/commit/8c987ff37e09884e3de8fff9c87f817291bc2a71))
- 🐛 Fixed reloading of locale files ([2f653d7](https://github.com/seznam/ima/commit/2f653d77d1865b5cb4fb321aeba3593bc1918a70))
- 🐛 Fixed server-side HMR ([19b9a24](https://github.com/seznam/ima/commit/19b9a24f59a1138a9ac767ce78b6d51d50b50dff))
- 🐛 Fixed server-side runtime errors ([b8512eb](https://github.com/seznam/ima/commit/b8512eb07c788432ea293c5d94d4486bb036b504))
- 🐛 Location of localized files ([b258e21](https://github.com/seznam/ima/commit/b258e21e3f29cea4f272f9142e4030689c34aa09))
- 🐛 Minor HMR error handling fixes ([1f15b7d](https://github.com/seznam/ima/commit/1f15b7d005e5aa7d9a572b74fa1b7ce17a8bf5b5))
- 🐛 Reverted back to using mini-css-extract-plugin by defaul ([c9da2f7](https://github.com/seznam/ima/commit/c9da2f7f41f2d2e264cd4205bf383716947112a3))
- 🐛 updated packagelocks ([c3d6ce1](https://github.com/seznam/ima/commit/c3d6ce1f8b4d224673793261f60469f3c840b096))

### Features

- 🎸 Added basic fast-refresh error-overlay interop ([6249ce9](https://github.com/seznam/ima/commit/6249ce98e89c7d5b6033e4ee5863614dd7c4f152))
- 🎸 Added dev server public, port and hostname options ([c68d150](https://github.com/seznam/ima/commit/c68d150eb7a69df8658dd04588aa622b0f696e76))
- 🎸 Added forceSPA flag to ima dev script ([adbdb70](https://github.com/seznam/ima/commit/adbdb707bc44ace0857f620da6b884ef2b2f718e))
- 🎸 Added new server 'dev' logger ([f928862](https://github.com/seznam/ima/commit/f92886247ab10cc64893ee40e0e9129324cde3c5))
- 🎸 Added stack frame mapping to original source ([58d0be7](https://github.com/seznam/ima/commit/58d0be70cc63de92075cdd30e693f5af7d4cb89a))
- 🎸 Better server init app errors handling ([7e9b28b](https://github.com/seznam/ima/commit/7e9b28b28ced86b8d59168a854c81b395a1f8f6d))
- 🎸 init Localize feature implementation ([daac90a](https://github.com/seznam/ima/commit/daac90acf4040b72f0ad3ec13fb1405b46d4497e))
- 🎸 Migrated from chalk to picocolors ([af67e8a](https://github.com/seznam/ima/commit/af67e8a4862603414b29f10d0e69a5216516dfe4))
- 🎸 Moved error-overlay feature behind \$Debug flag ([f42d290](https://github.com/seznam/ima/commit/f42d290ec07c760af45ba8d071b40b5364c67cd4))
- 🎸 New stack-trace parser, moved all parsing to overlay ([a4ceef5](https://github.com/seznam/ima/commit/a4ceef54664bee6f1d075f2f2e16b0ea676946fe))
- 🎸 Replace imaLoader for app/main by refactored appFactory ([3297b7b](https://github.com/seznam/ima/commit/3297b7b294b0dc237fc11f64c8606480b9152b92))
- 🎸 SSR error page is now reloaded upon rebuild ([cecd001](https://github.com/seznam/ima/commit/cecd0010df337ca0343902503c76d0434fc351e9))
- 🎸 UI optimizations ([a059078](https://github.com/seznam/ima/commit/a059078ba3dbd07310d4e4ed8481ff48ad523d41))
- 🎸 Updated verdacio ([f0cdbbe](https://github.com/seznam/ima/commit/f0cdbbe65ae523c74e3ddaad655dc0c0a689413a))

# [17.13.0](https://github.com/seznam/ima/compare/v17.12.3...v17.13.0) (2022-04-06)

**Note:** Version bump only for package @ima/server

## [17.12.2](https://github.com/seznam/ima/compare/v17.12.1...v17.12.2) (2022-02-07)

**Note:** Version bump only for package @ima/server

# [17.12.0](https://github.com/seznam/ima/compare/v17.11.3...v17.12.0) (2021-11-01)

### Features

- 🎸 Enable setting headers for redirects ([#141](https://github.com/seznam/ima/issues/141)) ([da0cb80](https://github.com/seznam/ima/commit/da0cb80d8719cd6b8811ceb62f7eb1e526e49193))

## [17.11.2](https://github.com/seznam/ima/compare/v17.11.1...v17.11.2) (2021-07-16)

### Bug Fixes

- 🐛 passing at least query params to error route ([#126](https://github.com/seznam/ima/issues/126)) ([6b1224e](https://github.com/seznam/ima/commit/6b1224edd28d4ff8e853d46e46ac2b9b4160da2e))

## [17.11.1](https://github.com/seznam/ima/compare/v17.11.0...v17.11.1) (2021-07-13)

### Bug Fixes

- 🐛 passing original params to not-found and error route ([#122](https://github.com/seznam/ima/issues/122)) ([131fb7f](https://github.com/seznam/ima/commit/131fb7fdb4d239c1efe49b9254ca1585e1b90315))

# [17.11.0](https://github.com/seznam/ima/compare/v17.10.0...v17.11.0) (2021-06-12)

### Bug Fixes

- 🐛 errorHandler middleware where app is next function ([37b5d51](https://github.com/seznam/ima/commit/37b5d5179ee2dea7a73498eb70141bbab43d9053))

# [17.9.0](https://github.com/seznam/ima/compare/v17.8.1...v17.9.0) (2021-03-21)

**Note:** Version bump only for package @ima/server

# [17.8.0](https://github.com/seznam/ima/compare/v17.7.10...v17.8.0) (2021-02-03)

**Note:** Version bump only for package @ima/server

## [17.7.9](https://github.com/seznam/ima/compare/v17.7.8...v17.7.9) (2020-12-08)

**Note:** Version bump only for package @ima/server

## [17.7.5](https://github.com/seznam/ima/compare/v17.7.4...v17.7.5) (2020-12-07)

**Note:** Version bump only for package @ima/server

## [17.7.3](https://github.com/seznam/ima/compare/v17.7.2...v17.7.3) (2020-08-14)

**Note:** Version bump only for package @ima/server

## [17.7.2](https://github.com/seznam/ima/compare/v17.7.1...v17.7.2) (2020-07-24)

**Note:** Version bump only for package @ima/server

# [17.7.0](https://github.com/seznam/ima/compare/v17.6.0...v17.7.0) (2020-05-28)

### Bug Fixes

- 🐛 Fix warning when using npm 6+ ([09b315a](https://github.com/seznam/ima/commit/09b315addf3ec6db8b8ff59b34c92aa017a0e562))

# [17.6.0](https://github.com/seznam/ima/compare/v17.5.3...v17.6.0) (2020-05-12)

### Features

- 🎸 Add Node 14 support ([75b9d8f](https://github.com/seznam/ima/commit/75b9d8f4adcc9b11fea5ebc3861ee6cea422e182))

# [17.5.0](https://github.com/seznam/ima/compare/v17.4.0...v17.5.0) (2020-03-02)

### Features

- 🎸 added overload server detection ([9cfac61](https://github.com/seznam/ima/commit/9cfac61c40c3df06ee6bb9145fd4eb7be1fc8a93))

# [17.4.0](https://github.com/seznam/ima/compare/v17.3.0...v17.4.0) (2020-01-09)

**Note:** Version bump only for package @ima/server

# [17.2.0](https://github.com/seznam/ima/compare/v17.1.1...v17.2.0) (2020-01-06)

### Features

- 🎸 the getBootConfig method is public ([db88f4d](https://github.com/seznam/ima/commit/db88f4d3bb121dc8ee463141ff50039fcf9d2d74))

## [17.0.1](https://github.com/seznam/ima/compare/v17.0.0...v17.0.1) (2019-12-06)

**Note:** Version bump only for package @ima/server

# [17.0.0](https://github.com/seznam/ima/compare/v17.0.0-rc.10...v17.0.0) (2019-12-06)

**Note:** Version bump only for package @ima/server

# [17.0.0-rc.9](https://github.com/seznam/ima/compare/v17.0.0-rc.8...v17.0.0-rc.9) (2019-12-04)

### Features

- 🎸 Dependencies update ([8ca12f3](https://github.com/seznam/ima/commit/8ca12f3e1c5f63c733e39aaf63d1fcf6ada967ba))

# [17.0.0-rc.7](https://github.com/seznam/ima/compare/v17.0.0-rc.6...v17.0.0-rc.7) (2019-11-28)

### Features

- 🎸 Add Node.js v12 support ([#9](https://github.com/seznam/ima/issues/9)) ([77d23f8](https://github.com/seznam/ima/commit/77d23f85975f7efba219399d1c2ebaaef063bb44))

# [17.0.0-rc.5](https://github.com/seznam/ima/compare/v17.0.0-rc.4...v17.0.0-rc.5) (2019-11-21)

**Note:** Version bump only for package @ima/server

# [17.0.0-rc.4](https://github.com/seznam/ima/compare/v17.0.0-rc.3...v17.0.0-rc.4) (2019-11-21)

**Note:** Version bump only for package @ima/server

# [17.0.0-rc.3](https://github.com/seznam/ima/compare/v17.0.0-rc.2...v17.0.0-rc.3) (2019-11-07)

**Note:** Version bump only for package @ima/server

# [17.0.0-rc.2](https://github.com/seznam/ima/compare/v17.0.0-rc.1...v17.0.0-rc.2) (2019-11-07)

**Note:** Version bump only for package @ima/server

# [17.0.0-rc.1](https://github.com/seznam/ima/compare/v17.0.0-rc.0...v17.0.0-rc.1) (2019-11-07)

**Note:** Version bump only for package @ima/server

# 17.0.0-rc.0 (2019-11-07)

**Note:** Version bump only for package @ima/server
