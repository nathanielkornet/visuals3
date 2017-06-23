const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'IS_HOST_CLIENT': false,
        'VR_CLIENT': true
        // ^^ this needs to only be true for vr-server. should probably
        // make another webpack.config for the vr server
      }
    })
  ],
  module: {
    rules: [
      {test: /\.js$/, use: 'babel-loader'}
    ]
  },
  node: {
    // need to include this to resolve weird fs module error
    // see: https://github.com/pugjs/pug-loader/issues/8#issuecomment-55568520
    fs: 'empty'
  }
}
