const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [
    nodeExternals({
      allowlist: [/^@nestjs\/(?!websockets|microservices)/], // Include solo i moduli necessari
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /@nestjs(\\|\/)core/,
      path.resolve(__dirname, 'src'),
      {}
    ),
  ],
};