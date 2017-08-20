var dotenvConfig = require('dotenv').config();  
var _ = require('lodash');  
var path = require('path');  
var webpack = require('webpack');  
var ionicWebpackFactory = require(process.env.IONIC_WEBPACK_FACTORY);
function getPlugins() {  
  var plugins = [
    new webpack.DefinePlugin({
      'process.env': _(process.env)
                    .pick(_.keys(dotenvConfig.parsed))
                    .mapValues((v) => (JSON.stringify(v)))
                    .value()
    })
  ];
  // for dev builds, use our custom environment
  return [
    ...plugins,
    ionicWebpackFactory.getIonicEnvironmentPlugin()
  ];
}
module.exports = {  
  entry: process.env.IONIC_APP_ENTRY_POINT,
  output: {
    path: '{{BUILD}}',
    publicPath: 'build/',
    filename: process.env.IONIC_OUTPUT_JS_FILE_NAME,
    devtoolModuleFilenameTemplate: ionicWebpackFactory.getSourceMapperFunction(),
  },
  devtool: process.env.IONIC_SOURCE_MAP_TYPE,
resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [path.resolve('node_modules')]
  },
module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.ts$/,
        loader: process.env.IONIC_WEBPACK_LOADER
      }
    ]
  },
plugins: getPlugins(),
// Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};