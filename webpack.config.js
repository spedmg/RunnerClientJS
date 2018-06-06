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
  externals: { asperaconnect: 'AW4' },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    overlay: true
  },
  resolve: {
    alias: {
      API: path.resolve(__dirname, 'src/api'),
      Config: path.resolve(__dirname, 'src/config'),
      Services: path.resolve(__dirname, 'src/services')
    }
  },
  mode: 'development'
};
