import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { ImaConfigurationContext, ImaConfig } from '../../types';
import { Plugin } from 'vite';

// Storage for the "runtime" content
// In Vite, we'll treat the entry chunk content as the 'runtime'
const runtimeStorage = {
  runtimeCode: '',
  esRuntimeCode: ''
};

export function imaRunnerPlugin(options: { context: ImaConfigurationContext; imaConfig: ImaConfig, runnerTemplate?: string }): Plugin {
  const { context, imaConfig } = options;
  let runnerTemplate;

  // Pre-compile template (mirroring your original logic)
  const templatePath = options.runnerTemplate ?? path.resolve(
    path.dirname(require.resolve('@ima/core')),
    '../../polyfill/runner.ejs'
  );
  runnerTemplate = ejs.compile(fs.readFileSync(templatePath, 'utf8'));

  return {
    name: 'ima:runner',
    // apply: 'build', // Only runs during production build
    applyToEnvironment(environment) {
      return environment.name !== 'server';
    },

    // We tap into the renderChunk hook to "steal" the code 
    // that needs to be wrapped in the runner.
    renderChunk(code, chunk) {
      if (!chunk.isEntry) return null;

      // Identify if this is the modern (es) or legacy chunk
      // based on the context passed from your CLI orchestrator
      if (this.environment.name !== 'legacy') {
        runtimeStorage.esRuntimeCode = code;
      } else {
        runtimeStorage.runtimeCode = code;
      }

      // We return the code unchanged, but we've captured it in storage
      return null;
    },
    // @TODO: Writing files during dev goes against Vite principles, we should probably split runner.js into "scripts loader" and "language localization"
    configureServer() {
      const { esRuntimeCode, runtimeCode } = runtimeStorage;
      const generatedRunner = runnerTemplate({
          forceLegacy: false,
          esRuntime: esRuntimeCode ? addSlashes(esRuntimeCode) : '// es.runtime not generated',
          runtime: runtimeCode ? addSlashes(runtimeCode) : '// runtime not generated',
        });

      fs.mkdirSync(path.resolve(context.rootDir, 'build/server'), { recursive: true });
      fs.writeFileSync(path.resolve(context.rootDir, 'build/server/runner.js'), generatedRunner);
    },

    // After the entire bundle is generated, we emit the runner.js
    async generateBundle() {
      const { esRuntimeCode, runtimeCode } = runtimeStorage;
      const { forceLegacy, command, legacy } = context;
      const { disableLegacyBuild } = imaConfig;

      // Implementation of your original conditional logic
      const shouldEmit =
        (disableLegacyBuild && esRuntimeCode) ||
        (command === 'build' && esRuntimeCode && runtimeCode) ||
        (command === 'dev' && legacy && esRuntimeCode && runtimeCode) ||
        (command === 'dev' && !legacy && esRuntimeCode);

      if (shouldEmit) {
        const generatedRunner = runnerTemplate({
          forceLegacy: !!forceLegacy,
          esRuntime: esRuntimeCode ? addSlashes(esRuntimeCode) : '// es.runtime not generated',
          runtime: runtimeCode ? addSlashes(runtimeCode) : '// runtime not generated',
        });

        this.emitFile({
          type: 'asset',
          fileName: 'server/runner.js',
          source: generatedRunner
        });
      }
    }
  };
}

// Re-using your helper for string escaping
function addSlashes(code: string): string {
  return code
    .replace(/\\/g, '\\\\')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}
