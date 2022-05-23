const path = require("path");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// 使用启用了Measure模式（打包测速）
const isMeasure = process.env.MEASURE === "true";
const isAnalyze = process.env.ANALYZE === "true";
const isDev = process.env.NODE_ENV === "development";
const smp = new SpeedMeasurePlugin({
  disable: !isMeasure,
});

const glob = require("glob-all");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const PATHS = {
  src: path.join(__dirname, "src"),
};
const dllPath = isDev ? './dll/dev' : './dll/prod';

// console.log(process.env.NODE_ENV, isDev);

module.exports = {
  // publicPath: "./",
  configureWebpack: smp.wrap({
    devtool: isDev ? 'eval-source-map' :  false,
    // 利用缓存提升二次构建速度
    cache: {
      type: "filesystem",
      // 默认为 node_modules/.cache/webpack。
      cacheDirectory: path.resolve(
        __dirname,
        "node_modules/.webpack_temp_cache"
      ),
    },
    performance: {
      hints: isDev ? false : "warning", // 枚举 false关闭
      maxEntrypointSize: 300 * 1024, // 最大入口文件大小
      // maxAssetSize: 300 * 1024, // 最大资源文件大小
    },
    optimization: {
      minimize: true, //代码压缩
      minimizer: [
        // 这将仅在生产环境开启 CSS 优化。
        new CssMinimizerPlugin(),
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
      splitChunks: {
        chunks: "all",
        minSize: 1 * 1024,
        minChunks: 1,
        name: "common",
        // 依赖太少，根据路径拆
        cacheGroups: {
          shop: {
            chunks: 'all',
            // INFO:[\\/] 理解成[], '\', '\/';windows是“\”，这写法参考官网例子
            // https://www.webpackjs.com/plugins/split-chunks-plugin/#optimization-splitchunks
            test: /[\\/]shop[\\/]/,
          },
          confirmOrder: {
            chunks: 'all',
            test: /[\\/]confirmOrder[\\/]/,
          },
          profile: {
            chunks: 'all',
            test: /[\\/]profile[\\/]/,
          },
          order: {
            chunks: 'all',
            test: /[\\/]order[\\/]/,
          },
          vipcard: {
            chunks: 'all',
            test: /[\\/]vipcard[\\/]/,
          },
          service: {
            chunks: 'all',
            test: /[\\/]service[\\/]/,
          },
          balance: {
            chunks: 'all',
            test: /[\\/]balance[\\/]/,
          },
          benefit: {
            chunks: 'all',
            test: /[\\/]benefit[\\/]/,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(gif|png|jpe?g|svg|webp)$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: "image-webpack-loader",
              options: {
                mozjpeg: {
                  progressive: true,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75,
                },
              },
            },
          ],
        },
      ],
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
        manifest: path.resolve(__dirname, dllPath, "vue.manifest.json"),
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, dllPath, "scroll.manifest.json"),
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: path.resolve(__dirname, dllPath, "showdown.manifest.json"),
      }),
      new AddAssetHtmlPlugin([
        { filepath: path.resolve(__dirname, dllPath, "vue.dll.js") },
        { filepath: path.resolve(__dirname, dllPath, "scroll.dll.js") },
        { filepath: path.resolve(__dirname, dllPath, "showdown.dll.js") },
      ]),
      new PurgeCSSPlugin(
        {
          paths: glob.sync([path.join(__dirname, "./src/**/*.vue")]),
          defaultExtractor(content) {
            const contentWithoutStyleBlocks = content.replace(
              /<style[^]+?<\/style>/gi,
              ""
            );
            return (
              contentWithoutStyleBlocks.match(
                /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
              ) || []
            );
          },
          safelist: [
            /-(leave|enter|appear)(|-(to|from|active))$/,
            /^(?!(|.*?:)cursor-move).+-move$/,
            /^router-link(|-exact)-active$/,
            /data-v-.*/,
          ],
        }
      )
    ],

  }),
};
