import nodeResolve from 'rollup-plugin-node-resolve'; // eslint-disable-line
import babel from 'rollup-plugin-babel'; // eslint-disable-line
import replace from 'rollup-plugin-replace'; // eslint-disable-line
import { terser } from 'rollup-plugin-terser'; // eslint-disable-line
import commonjs from 'rollup-plugin-commonjs'; // eslint-disable-line

import pkg from './package.json';

export default [
  // CommonJS
  {
    input: 'index.jsx',
    output: { file: 'lib/index.js', format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [babel()],
  },

  // ES
  {
    input: 'index.jsx',
    output: { file: 'es/index.js', format: 'es', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [babel()],
  },

  // ES for Browsers
  {
    input: 'index.jsx',
    output: { file: 'es/index.mjs', format: 'es', indent: false },
    plugins: [
      babel(),
      nodeResolve({
        jsnext: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },

  // UMD Development
  {
    input: 'index.jsx',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Redux',
      indent: false,
    },
    plugins: [
      nodeResolve({
        jsnext: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  },

  // UMD Production
  {
    input: 'index.jsx',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'Redux',
      indent: false,
    },
    plugins: [
      nodeResolve({
        jsnext: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
];
