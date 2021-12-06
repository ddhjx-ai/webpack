// 开发配置文件
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack')

const devWebpackConfig = merge(baseWebpackConfig, {
  // 这里是开发模式对的配置
  mode: 'development',

  plugins: [
    new webpack.DefinePlugin({
      // 开发环境下的接口地址
      // 这里的属性值是一个代码片段，而不是字符串
      API_BASE_URL: JSON.stringify('http://apidev.abc.com')
    }),
    // html 配置
    new HtmlWebpackPlugin({
      // 指定打包后的文件名称
      filename: "index.html",
      // 用来指定生成 html 的木板
      template: "./src/index.ejs",
      // 指定 html 中使用的变量
      title: "webpack首页"
    }),
    // 可以同时打包多个html
    new HtmlWebpackPlugin({
      filename: "about.html",
      template: "./src/index.ejs",
      title: "关于我们"
    }),
  ]
})

module.exports = devWebpackConfig