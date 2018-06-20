const path = require('path');

module.exports = {
  entry: {
    api: './src/index.js',
    components: './src/components.js',
    polyfill: './src/polyfill.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'runner_client.[name].js',
    library: 'RunnerClient',
    libraryExport: 'default'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    publicPath: '/dist/'
  },
  resolve: {
    alias: {
      API: path.resolve(__dirname, 'src/api'),
      Components: path.resolve(__dirname, 'src/components'),
      Config: path.resolve(__dirname, 'src/config'),
      Services: path.resolve(__dirname, 'src/services')
    }
  },
  mode: 'development'
};
