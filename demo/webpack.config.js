process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'es'

module.exports = {
  context: __dirname,
  entry: './index.js',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: __dirname,
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
