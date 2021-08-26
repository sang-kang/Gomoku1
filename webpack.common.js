const path = require('path');

module.exports = {
  entry: {app: [path.resolve(__dirname, "src/index.ts")]},
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [path.resolve(__dirname, "node_modules")],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'json']
  },
  output: {
    filename: 'index-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};