const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: fs.readdirSync(__dirname).reduce((entries, dirname) => {
    const configPath = path.join(__dirname, dirname);
    if (fs.existsSync(path.join(configPath, 'app.js'))) {
      entries[path.basename(configPath)] = [
        path.resolve(configPath, 'app.js'),
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
      ];
    }
    return entries;
  }, {}),
  output: {
    path: path.join(__dirname, 'built'),
    filename: '[name].js',
    publicPath: '/built/',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: [
            'decorators-legacy',
            'react',
            'react-hmre',
          ],
        },
        exclude: /node_modules/,
      },
    ],
  },

  devServer: {
    hot: true,
    proxy: {
      '*': 'http://localhost:9090'
    },
    stats: {
      colors: true,
      chunks: false,
    },
  },

  resolve: {
    alias: {
      'react-replaceables$': '../src/index',
    },
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};
