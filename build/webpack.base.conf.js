var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './demo/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('demo'),
      'src': resolve('src')
    }
  },
  // resolveLoader: {
  //   alias: {
  //     'code-loader': path.join(__dirname, 'build', 'code-loader.js')
  //   }
  // },
  module: {
    rules: [
      // {
      //   test: /_examples\.vue$/,
      //   // loader: 'raw-loader',
      //   loader: require.resolve('./example_loader.js'),
      // },
      {
        test: /\.vue$/,
        exclude: /_examples\.vue$/,
        use: [
          // {
          //   loader: require.resolve('./inject-loader.js'),
          //   options: {}
          // },
          {
            loader: 'vue-loader',
            options: vueLoaderConfig
          }
         
          // {
          //   loader: 'vue-loader',
          //   options: {
          //     loaders: {
          //       'example': codeLoader
          //     }
          //   }
          // }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [resolve('demo'), resolve('src'), resolve('tests')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
