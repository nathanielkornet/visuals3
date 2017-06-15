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
      // NOTE: need to use this maybe somehow to prevent midi stuff
      // from being included in build
      USE_MIDI: false
    })
  ],
  module: {
    rules: [
      {test: /\.js$/, use: 'babel-loader'}
    ]
  },
  node: {
    fs: 'empty'
  }
}
