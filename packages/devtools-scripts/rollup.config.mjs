import { babel } from '@rollup/plugin-babel';

import { createRollupConfig } from '../../createRollupConfig.mjs';

// Wraps generated code with init function used in devtools
function wrapCode(code) {
  return `// DO NOT MODIFY FILE, FILE IS AUTO GENERATED FROM OTHER REPOSITORIES

export default function(hooks) {
return \`
${code}
createDevtool(({ importIMAClass, clone, aop, createHook, hookName, createCallTrap, emit }) => { \${Object.values(hooks).filter(hook => hook.enabled).map(hook => hook.code).join("\\n\\n")} });
\`;
}
  `;
}

export default createRollupConfig(config => ({
  ...config,
  treeshake: false,
  external: [/@babel\/runtime/],
  plugins: [
    ...config.plugins,
    babel({
      babelHelpers: 'bundled',
      comments: false,
      plugins: ['@babel/plugin-transform-template-literals'],
    }),
    {
      // Create new entries with code wrapped in init function
      generateBundle(outputOptions, bundle) {
        const entry = Object.values(bundle).find(chunk => chunk.isEntry);
        const [name, extension] = entry.fileName.split('.');

        this.emitFile({
          type: 'asset',
          fileName: [name, 'string', extension].join('.'),
          source: wrapCode(entry.code),
        });
      },
    },
  ],
}));
