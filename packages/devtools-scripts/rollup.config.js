import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const config = {
  cache: false,
  treeshake: false,
  input: './src/main.js',
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main'],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
};

if (env === 'es' || env === 'cjs') {
  config.output = Object.assign(config.output || {}, { format: env });
}

export default config;
