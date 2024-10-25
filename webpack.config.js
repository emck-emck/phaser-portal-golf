import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import webpack from 'webpack';

export default {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'), // Ensure this points to the correct directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.html$/,
        use: [
          'html-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html', // Ensure this points to your source HTML file
      filename: 'index.html', // The output file name in the dist folder
      inject: 'body',
    }),
    new webpack.HotModuleReplacementPlugin(), // Add this plugin
  ],
  devServer: {
    static: {
      directory: path.resolve('public'), // Serve static files from the dist directory
    },
    compress: true,
    port: 9000,
    hot: true, // Enable hot module replacement
  },
  mode: 'development',
};
