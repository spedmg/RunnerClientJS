const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'runner_client.js',
    library: 'RunnerClient',
    libraryExport: 'default',
    libraryTarget: 'var'
  },
  // externals: ['axios', 'lodash'],
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    index: 'example.html',
    overlay: true
  },
  mode: 'development'
};
