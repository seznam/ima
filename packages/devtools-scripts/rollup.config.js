import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  cache: false,
  treeshake: false,
  input: './src/main.js',
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main']
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
};

if (env === 'es' || env === 'cjs') {
  config.output = Object.assign(config.output || {}, { format: env });
}

if (env === 'umd') {
  config.output = { format: 'umd', name: 'ConsumeMultipleContexts' };

  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
