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
  externals: {
    axios: {
      commonjs: 'axios',
      commonjs2: 'axios',
      amd: 'axios',
      root: 'axios'
    }
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
};
