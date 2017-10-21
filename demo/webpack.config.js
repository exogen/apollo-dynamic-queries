process.env.NODE_ENV = 'development'

module.exports = {
  context: __dirname,
  entry: './index.js',
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
