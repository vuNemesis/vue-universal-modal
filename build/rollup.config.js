import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
// import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: '../src/index.js',
    output: {
      name: 'VueUniversalModal',
      file: "../dist/vue-universal-modal.umd.js",
      format: 'umd'
    },
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs(), 
      babel({
        exclude: ['../node_modules/**']
      }),
      (process.env.NODE_ENV === 'production' && uglify()),
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify 
  // `file` and `format` for each target)
  {
    input: '../src/index.js',
    // external: ['ms'],
    output: [
      { file: "../dist/vue-universal-modal.cjs.js", format: 'cjs' },
      { file: "../dist/vue-universal-modal.esm.js", format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['../node_modules/**']
      }),
      (process.env.NODE_ENV === 'production' && uglify()),
    ]
  }
];