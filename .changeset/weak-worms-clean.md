---
"@ima/cli": minor
---

Added new export for `findRules`, this is simple helper function you can use to extract rules from webpack config in yor plugins for easier customization.
Added new export for `createWebpackConfig`, when provided with CLI args and imaConfig, it generates webpack configurations which are then passed to webpack compiler. This can be usefull for other tooling like StoryBook, where you need to customize different webpack config with fields from the IMA app one.
Added additional `ImaConfigurationContext` variables: `isClientES`, `isClient` and `outputFolders`
Removed `isESVersion` `ImaConfigurationContext` variable (use `isClientES` instead).
Added support for `prepareConfigurations` CLI plugin method, which lets you customize webpack configuration contexts, before generating webpack config from them.
Added new `cssBrowsersTarget` ima.config.js settings, this allows you to easily customize `postcss-preset-env` `browsers` targets field.
