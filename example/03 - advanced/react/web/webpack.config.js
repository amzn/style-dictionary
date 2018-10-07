const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const autoprefixer = require('autoprefixer');

const PATHS = {
  app: path.join(__dirname, 'src'),
  styles: path.join(__dirname, 'src/sass/styles.scss'),
  sass: path.join(__dirname, 'src/sass'),
  build: path.join(__dirname, 'build'),
  images: path.join(__dirname, 'src/images'),
  assets: path.join(__dirname, 'src/assets')
};

const common = {
  entry: {
    app: PATHS.app,
    styles: PATHS.styles
  },
  output: {
    path: PATHS.build,
    filename: '[name].[hash].js'
  },
  devtool: "eval-source-map",
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  postcss: function (webpack) {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Style Dictionary',
      template: 'index.ejs'
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),
  ],
  module: {
    loaders: [
      {
        test : /\.(jsx|js)?$/,
        loader : 'babel-loader',
        exclude: /node_modules/
      },{
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000',
        include: PATHS.images
      },{
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
        include: PATHS.sass
      },{
        test: /\.ttf$|\.eot$|\.woff$|\.woff2$/,
        loader: 'file-loader',
        include: PATHS.app
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
    host: 'localhost',
    port: '8080'
  }
};

module.exports = validate(common, {
  quiet: true
});
