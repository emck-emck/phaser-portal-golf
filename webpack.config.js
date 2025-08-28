import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import webpack from "webpack";

const __dirname = path.resolve(); // Needed in ES modules

export default {
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "", // ensures relative paths for assets
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        type: "asset/resource", // modern replacement for file-loader
        generator: {
          filename: "assets/[name][ext]",
        },
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    // Generates dist/index.html that pulls in bundle.js
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: "body",
    }),

    // Copies static assets (e.g. images, audio, json, etc.) from /public to /dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          noErrorOnMissing: true,
        },
      ],
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"), // serve from dist
    },
    compress: true,
    port: 9000,
    hot: true
  },

  mode: "development",
};
