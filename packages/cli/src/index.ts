export {
  type ImaCliPlugin,
  type ImaConfig,
  type ImaCliCommand,
  type ImaCliArgs,
  type ImaConfigurationContext,
} from './types';

export {
  IMA_CONF_FILENAME,
  createCacheKey,
  createDevServerConfig,
  getCurrentCoreJsVersion,
  resolveEnvironment,
  resolveImaConfig,
  createViteConfig,
  runImaPluginsHook,
} from './vite/utils/utils';
export {
  imaLanguagesPlugin,
  getVirtualLanguageEntryPoints,
} from './vite/plugins/imaLanguagesPlugin';
export {
  getDictionaryKeyFromFileName,
  generateTypeDeclarations,
} from './vite/languages';
