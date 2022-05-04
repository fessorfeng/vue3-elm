const path = require("path");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");

// 使用启用了Measure模式（打包测速）
const isMeasure = process.env.MEASURE === "true";
const smp = new SpeedMeasurePlugin({
  disable: !isMeasure,
});

module.exports = {
  // publicPath: "./",
  configureWebpack: smp.wrap({
    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
        assets: path.resolve(__dirname, "./src/assets"),
        components: path.resolve(__dirname, "./src/components"),
      },
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: isMeasure ? "server" : "disabled",
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, './dll/vue.manifest.json'),
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, './dll/scroll.manifest.json'),
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, './dll/showdown.manifest.json'),
      })
    ],
  }),
};
