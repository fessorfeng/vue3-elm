const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    vue: ["vue", "vue-router", "vuex"],
    scroll: ["better-scroll", "iscroll"],
    showdown: ["showdown"],
  },
  output: {
    path: path.resolve(__dirname, "../dll"),
    filename: "[name].dll.js",
    library: "[name]_[fullhash:6]",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      context: process.cwd(),
      path: path.resolve(__dirname, "../dll", "[name].manifest.json"),
      name: "[name]_[fullhash:6]",
    }),
  ],
};
