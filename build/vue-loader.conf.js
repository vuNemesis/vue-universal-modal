var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

var loaders = utils.cssLoaders({
  sourceMap: sourceMapEnabled,
  extract: isProduction
})

loaders.example = require.resolve('./code-loader.js')

module.exports = {
  loaders,
  cssSourceMap: sourceMapEnabled
}
