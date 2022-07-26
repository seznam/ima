# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [18.0.0-rc.3](https://github.com/seznam/ima/compare/v18.0.0-rc.2...v18.0.0-rc.3) (2022-07-14)


### Bug Fixes

* 🐛 Fixed critical bug in compilation of vendors ([26494ce](https://github.com/seznam/ima/commit/26494ce9539fb9882c48ea80b47d48b5f0befeb8))
* 🐛 hotfix error overlay runtime error parsing ([947ed6c](https://github.com/seznam/ima/commit/947ed6c52003d7a8e91831a414bd84f9bda13a2c))
* 🐛 Replaced source-map with source-map-js ([#218](https://github.com/seznam/ima/issues/218)) ([f201896](https://github.com/seznam/ima/commit/f20189683eae9874b7c2ae1b1d3544d0636a4dcc))





# [18.0.0-rc.1](https://github.com/seznam/ima/compare/v18.0.0-rc.0...v18.0.0-rc.1) (2022-06-21)


### Bug Fixes

* 🐛 Fixed issue with displaying compile errors in overlay ([#210](https://github.com/seznam/ima/issues/210)) ([0e8ba96](https://github.com/seznam/ima/commit/0e8ba9697f8f0ac1cca223766e858e5d8ba5fff8))





# [18.0.0-rc.1](https://github.com/seznam/ima/compare/v18.0.0-rc.0...v18.0.0-rc.1) (2022-06-21)


### Bug Fixes

* 🐛 Fixed issue with displaying compile errors in overlay ([#210](https://github.com/seznam/ima/issues/210)) ([0e8ba96](https://github.com/seznam/ima/commit/0e8ba9697f8f0ac1cca223766e858e5d8ba5fff8))





# [18.0.0-rc.0](https://github.com/seznam/ima/compare/v17.12.3...v18.0.0-rc.0) (2022-05-26)


### Bug Fixes

* 🐛 babel parser fixes, fixed new compile format err parsing ([63db8e7](https://github.com/seznam/ima/commit/63db8e711f27dd31163db301324ad1cf835e320c))
* 🐛 Better error handling in compiler, overlay and hmr ([ce101e3](https://github.com/seznam/ima/commit/ce101e37557e3929b287c50c734c6ab46cec57cb))
* 🐛 error-overlay and runtime error reporting fixes ([07b9d29](https://github.com/seznam/ima/commit/07b9d2972d7e90c6f8ef943e8f721841e0006882))
* 🐛 fixed build ([107ac2d](https://github.com/seznam/ima/commit/107ac2d32be00128d836276050693b2332305712))
* 🐛 Fixed compile error parsing ([e9013a3](https://github.com/seznam/ima/commit/e9013a3e1ab020f31621d059a91027ef7b671877))
* 🐛 Fixed error-overlay view compiled btn text wrapping ([0ca3f1c](https://github.com/seznam/ima/commit/0ca3f1cac96b66ec1aaa2d012a63796559f9ad55))
* 🐛 Fixed eval-source-map middleware runtime error parsing ([721469d](https://github.com/seznam/ima/commit/721469d8500c62537d833bc1ebb228c905a8ebd7))
* 🐛 fixed relative urls in error overlay ([d528717](https://github.com/seznam/ima/commit/d5287173cbaa7aee0f245ddec330127dc99f0418))
* 🐛 Fixed server-side runtime errors ([b8512eb](https://github.com/seznam/ima/commit/b8512eb07c788432ea293c5d94d4486bb036b504))
* 🐛 Fixed SWC error parser ([26c1c78](https://github.com/seznam/ima/commit/26c1c783af2c48ca8e96ed2fdb9aa7c101a2dc9f))
* 🐛 HMR fixes ([3b9fafd](https://github.com/seznam/ima/commit/3b9fafd7637edc9ac52131fbd77749a40328dfe3))
* 🐛 Minor source storage cache fixes) ([6a2c7d0](https://github.com/seznam/ima/commit/6a2c7d0ea38804a9451a8ac8fce6053c164fe001))
* 🐛 Multiple overlay style fixes ([a6437c8](https://github.com/seznam/ima/commit/a6437c84a8547d55edcf5d8836aabfb6dde990d2))
* 🐛 Reverted back to using mini-css-extract-plugin by defaul ([c9da2f7](https://github.com/seznam/ima/commit/c9da2f7f41f2d2e264cd4205bf383716947112a3))
* 🐛 tsconfig fixes ([27d3b56](https://github.com/seznam/ima/commit/27d3b56391697273a236d4b83b4fd96bc47a1b85))
* 🐛 updated packagelocks ([c3d6ce1](https://github.com/seznam/ima/commit/c3d6ce1f8b4d224673793261f60469f3c840b096))


### Features

* 🎸 Added "Open in editor" button in error overlay ([adf5211](https://github.com/seznam/ima/commit/adf52111dba6825b80d0e6641f82cbd166fdf4e9))
* 🎸 Added analyze cli plugin ([f6b5026](https://github.com/seznam/ima/commit/f6b5026f43e7c0765e22e25f10e6e533bd94a180))
* 🎸 Added dev server public, port and hostname options ([c68d150](https://github.com/seznam/ima/commit/c68d150eb7a69df8658dd04588aa622b0f696e76))
* 🎸 Added ErrorBoundary and fixed HMR error reporting ([81ae9cd](https://github.com/seznam/ima/commit/81ae9cd90a775a1d22350dcd5f07677e8127ae87))
* 🎸 Added experimental ima and fast refresh overlay clients ([fc7d7e1](https://github.com/seznam/ima/commit/fc7d7e1f7ad21b637df7b30c9a5067a6a920848d))
* 🎸 Added ima-legacy-plugin-loader ([2421f08](https://github.com/seznam/ima/commit/2421f08f5ed806f38597a5d9a094b2369eeac282))
* 🎸 Added new server 'dev' logger ([f928862](https://github.com/seznam/ima/commit/f92886247ab10cc64893ee40e0e9129324cde3c5))
* 🎸 Added profile option to production build ([ff6baf6](https://github.com/seznam/ima/commit/ff6baf66f38219c539a7d6c2b55c37abfaf6fe78))
* 🎸 Added progress plugin to indicate built progress ([7decf8f](https://github.com/seznam/ima/commit/7decf8fe58bf52f318329c44b1575068c9e8a6cc))
* 🎸 Automatic react runtime ([66ef765](https://github.com/seznam/ima/commit/66ef765ce095474ef9f50c4207fb6bca23096993))
* 🎸 Basic support for compile errors ([b8796d2](https://github.com/seznam/ima/commit/b8796d2bfcbc510cefdb9818d6aa3d4e845cc8fa))
* 🎸 Compile error message formatter ([b571f2c](https://github.com/seznam/ima/commit/b571f2cfdb397436ce5e9d29a5f6f396af88cd69))
* 🎸 Load wasm from local static files ([8741f36](https://github.com/seznam/ima/commit/8741f3667809f1cc6b2aefc10c19b04d9bdf5185))
* 🎸 Server-side console compile error reporting ([1a5d988](https://github.com/seznam/ima/commit/1a5d98808e263f271d4b15fcda69a81beea55f0b))
* 🎸 The error overlay iframe can now be closed ([e2c7532](https://github.com/seznam/ima/commit/e2c75320ecd63f136f957766fa748dcc72174139))
* 🎸 UI Enhancements ([d77ed38](https://github.com/seznam/ima/commit/d77ed3823aef6bdae75256499659a390b1a04cb0))
* 🎸 UI optimizations ([a059078](https://github.com/seznam/ima/commit/a059078ba3dbd07310d4e4ed8481ff48ad523d41))
* 🎸 UI, HMR, Compile error handling improvements ([96d49fb](https://github.com/seznam/ima/commit/96d49fb04fd06b58459add7427d59f0fd007bbbb))


### Performance Improvements

* ⚡️ devServer gzipped and cached static serving ([c65b4ef](https://github.com/seznam/ima/commit/c65b4efe1c223b71860b71bd0bf65afc8a1343df))
* ⚡️ Performance improvements, improved IE11 support ([7d40449](https://github.com/seznam/ima/commit/7d40449c55ac10f3c4b19c3f9108e0465a8f8a46))
* ⚡️ Performance optimizations ([361c546](https://github.com/seznam/ima/commit/361c546151ccb434252f5f681722218bdfb6ec50))
* ⚡️ Source map optimizations ([ceef138](https://github.com/seznam/ima/commit/ceef138d4c3918c277301bb78aeaa39e9db50da1))
