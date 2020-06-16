const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin= require('html-webpack-plugin')

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          }]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          }, 'sass-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['ianime', 'vendor']
    }),
    ...[
      'anime',
      'episode',
      'search',
      'dmca',
      'privacy',
      'terms',
      'about',
      'stats',
    ].map(a => new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: a + '.html',
      chunks: [a, 'vendor']
    }))
  ],
  devServer: {
    host: '192.168.8.20'
  }
});
