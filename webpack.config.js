const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'runner_client.js',
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
    index: 'dist/index.html',
    host: '0.0.0.0',
    useLocalIp: true
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
