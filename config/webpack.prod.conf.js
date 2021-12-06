// 生产配置文件
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require('webpack')

const proWebpackConfig = merge(baseWebpackConfig, {
  // 这里是生产模式的配置
  mode: "production",

  plugins: [
    new webpack.DefinePlugin({
      // 开发环境下的接口地址
      API_BASE_URL: JSON.stringify('http://apiprod.abc.com')
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // html 配置
    new HtmlWebpackPlugin({
      // 指定打包后的文件名称
      filename: "index.html",
      // 用来指定生成 html 的木板
      template: "./src/index.ejs",
      // 指定 html 中使用的变量
      title: "webpack首页",
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    // 可以同时打包多个html
    new HtmlWebpackPlugin({
      filename: "about.html",
      template: "./src/index.ejs",
      title: "关于我们",
      // html 压缩
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
  ],
});

module.exports = proWebpackConfig;
