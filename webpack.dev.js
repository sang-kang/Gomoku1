const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = Object.assign(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      compress:true,
      port:8888,    //8080
      historyApiFallback: {
        index: '/'
      },
      watchContentBase: true
  },
  plugins: [
    new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, "public/index.html"),
    }),
  ]
});