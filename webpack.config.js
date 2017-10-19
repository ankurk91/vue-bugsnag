'use strict';

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const packageJson = require('./package.json');

module.exports = {
  context: __dirname,
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.jsx', '.json', '.vue']
  },
  entry: {
    'vue-bugsnag': './src/index.js',
    'vue-bugsnag.min': './src/index.js',
  },
  // Don't include them into library build
  externals: [
    'vue',
    'bugsnag-js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),// where to store build files
    filename: "[name].js", // build file name
    library: 'VueBugsnag',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
    }),
    new webpack.BannerPlugin({
      banner: `name: ${packageJson.name}\nauthor: ${packageJson.author}\nlicense: ${packageJson.license}\n${packageJson.homepage}`
    })
  ],
  devtool: false,
  performance: {
    hints: false,
  }
};
