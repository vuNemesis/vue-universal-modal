import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
// import pkg from './package.json';

var env = process.env.NODE_ENV
var config = {
  exports: 'named',
  format: 'umd',
  moduleName: 'VueUniversalModal',
  plugins: [
    // scss({
    //   output: 'dist/vue-universal-slider.css'
    // }),
    postcss({
      extract: env === 'production' ? 'dist/vue-universal-modal.min.css' : 'dist/vue-universal-modal.css',
      plugins: [autoprefixer],
      minimize: env === 'production' ? true : false
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    // due to https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
    commonjs(),
    // commonjs({
    //   include: 'node_modules/**',
    //   namedExports: { './node_module/invariant.js': ['default'] }
    // }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config

// export default [
//   // browser-friendly UMD build
//   {
//     input: 'src/index.js',
//     output: {
//       name: 'VueUniversalSlider',
//       file: "dist/vue-universal-slider.umd.js",
//       format: 'umd'
//     },
//     plugins: [
//       resolve({
//         jsnext: true,
//         main: true,
//         browser: true,
//       }),
//       commonjs(), 
//       babel({
//         exclude: ['node_modules/**']
//       }),
//       (process.env.NODE_ENV === 'production' && uglify()),
//     ]
//   },

//   // CommonJS (for Node) and ES module (for bundlers) build.
//   // (We could have three entries in the configuration array
//   // instead of two, but it's quicker to generate multiple
//   // builds from a single configuration where possible, using
//   // an array for the `output` option, where we can specify 
//   // `file` and `format` for each target)
//   {
//     input: 'src/index.js',
//     // external: ['ms'],
//     output: [
//       { file: "dist/vue-universal-slider.cjs.js", format: 'cjs' },
//       { file: "dist/vue-universal-slider.esm.js", format: 'es' }
//     ],
//     plugins: [
//       babel({
//         exclude: ['node_modules/**']
//       }),
//       (process.env.NODE_ENV === 'production' && uglify()),
//     ]
//   }
// ];