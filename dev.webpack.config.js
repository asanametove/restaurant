const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, 'client', 'src');
const distPath = path.resolve(__dirname, 'client', 'dist');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?noInfo=true',
    path.resolve(srcPath, 'index.js')
  ],
  devtool: 'inline-source-map',
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          }, 
          {
            loader: "css-loader"
          }, 
          {
            loader: "sass-loader",
          }
        ]
      },
      {
        test: /\.(png|svg|gif|jpg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
