const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'runnerclient.js',
    chunkFilename: 'runnerclient.[name].js',
    library: 'RunnerClient',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    publicPath: 'dist/'
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
