const path = require("path");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

// 使用启用了Measure模式（打包测速）
const isMeasure = process.env.MEASURE === "true";
const isAnalyze = process.env.ANALYZE === "true";
const smp = new SpeedMeasurePlugin({
  disable: !isMeasure,
});

module.exports = {
  // publicPath: "./",
  configureWebpack: smp.wrap({
    // 利用缓存提升二次构建速度
    cache: {
      type: "filesystem",
      // 默认为 node_modules/.cache/webpack。
      cacheDirectory: path.resolve(
        __dirname,
        "node_modules/.webpack_temp_cache"
      ),
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
        assets: path.resolve(__dirname, "./src/assets"),
        components: path.resolve(__dirname, "./src/components"),
      },
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: isAnalyze ? "server" : "disabled",
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, "./dll/vue.manifest.json"),
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, "./dll/scroll.manifest.json"),
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, "./dll/showdown.manifest.json"),
      }),
      new AddAssetHtmlPlugin([
        { filepath: path.resolve(__dirname, "./dll/vue.dll.js") },
        { filepath: path.resolve(__dirname, "./dll/scroll.dll.js") },
        { filepath: path.resolve(__dirname, "./dll/showdown.dll.js") },
      ]),
    ],
  }),
};
