const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development" || process.env.DEV === 'true';
const dllPath = isDev ? '../dll/dev' : '../dll/prod';

// console.log(process.env.NODE_ENV, isDev)
module.exports = {
  mode: isDev ? "development" : "production",
  entry: {
    vue: ["vue", "vue-router", "vuex"],
    scroll: ["better-scroll", "iscroll", "fastclick"],
    showdown: ["showdown"],
  },
  output: {
    path: path.resolve(__dirname, dllPath),
    filename: "[name].dll.js",
    library: "[name]_[fullhash:6]",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      context: process.cwd(),
      path: path.resolve(__dirname, dllPath, "[name].manifest.json"),
      name: "[name]_[fullhash:6]",
    }),
  ],
  optimization: {
    minimize: true, //代码压缩
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
