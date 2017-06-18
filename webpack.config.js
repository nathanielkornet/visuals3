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
        'IGNORE_MIDI': true
      }
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
