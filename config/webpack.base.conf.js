// 公共配置文件

const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

// 通用的样式loader
const commonStyleLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: "../",
    },
  },

  // 1.将css转成js
  "css-loader",

  // 0.通过 postcss-loader 给样式属性添加浏览器前缀
  "postcss-loader",
];

module.exports = {
  // 入口文件
  entry: "./src/index.js",

  // 出口配置
  output: {
    // 输出目录（输出目录必须是绝对路径）
    path: resolve(__dirname, "../dist"),
    // 输出文件名称
    filename: "main.js",
  },

  // 模块配置
  module: {
    rules: [
      // 指定多个配置规则
      {
        test: /\.css$/i,
        // use 中的 loader 的加载顺序：先下后上
        use: commonStyleLoader,
      },

      {
        test: /\.less$/i,
        use: [...commonStyleLoader, "less-loader"],
      },

      // 编译js
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  // 按需加载
                  useBuiltIns: "usage",
                  // core-js 版本
                  corejs: 3,
                  // targets: "defaults"  // 配置js运行环境
                  targets: {
                    chrome: "58",
                    ie: "9",
                    firefox: "60",
                    safari: "10",
                    edge: "17",
                  },
                },
              ],
            ],
          },
        },
      },

      // 处理图片
      {
        test: /\.(png|gif|jpe?g)$/i,
        // webpack4
        /* use:{
          loader: 'url-loader',
          options: {
            // 指定图片大小，小于该数值的图片会被转成 base64
            limit: 5 * 1024,
            // [name]是图片原来的名称，[ext]是图片原来的后缀名
            name: 'image/[name].[ext]',
            // webpack5下，base64编码的图片是打包后的css的background的url中引用的
            // url-loader,file-loader都是采用es6语法规范的，而不是commonjs规范由于url-loader,file-loader中可以通过esModule属性来选择是否关闭es6语法规范，故解决方法为添加如下语句关闭es6语法规范：
            esModule: false,
          }
        },
        // 我们在webpack5.0中使用了旧的资源模块加载器，如file-loader,url-loadre这些，但是webpack5.0本身已经内置了asset资源模块来处理，这就可能会导致asset重复。解决方法：将asset的模块类型设置为 
        type: 'javascript/auto' */

        // webpack5
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 6 * 1024,
          },
        },
        generator: {
          // webpack5 文件后缀自动带有 .
          filename: "image/[name][ext]",
        },
      },

      // html-loader
      /* {
        test: /\.(html|htm)$/i,
        use: {
          loader: 'html-loader',
          options:{
            // webpack4 中只需要在 url-loader 配置 ：esModule: false
            // webpack5 需要 html-loader 也配置：esModule: false
            esModule: false
          }
        }
      }, */

      // 字体文件
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        // webpack4 写法
        /* use:{
          loader: 'file-loader',
          options:{
            name: 'font/[name].[ext]'
          }
        } */

        // webpack5写法
        // asset 可以在 asset/resource 和 asset/inline 之间进行选择
        // 如果文件小于 8kb，则使用 asset/inline 类型
        // 如果文件大于 8kb，则使用 asset/resource 类型
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          // webpack5 文件后缀自动带有 .
          filename: "font/[name][ext]",
        },
      },
    ],
  },

  // 开发服务器
  devServer: {
    // 指定加载内容的路径
    contentBase: resolve(__dirname, "dist"),

    // 启用 gzip 压缩
    compress: true,

    // 端口号
    port: 8888,

    // 热更新(禁用hot)
    liveReload: true,

    // 接口代理：解决接口跨域
    proxy: {
      // http://localhost:8080/api
      "/api": {
        // http://localhost:8080/api/users 相当于访问 https://api.github.com/api/users
        target: "https://api.github.com",
        // http://localhost:8080/api/users 相当于访问 https://api.github.com/users
        pathRewrite: {
          "^/api": "",
        },
        // 不能使用 localhost:8080 作为请求的主机名
        changeOrigin: true,
      },
    },
  },
  // 配置目标
  target: "web",

  plugins: [
    new MiniCssExtractPlugin({
      // 指定打包后的css文件名
      filename: "css/[name].css",
    }),
    new StylelintPlugin({
      // 指定需要进行格式校验的文件
      files: ["src/css/*.{css,less,sass,scss}"],
    }),
    // 压缩css
    // new OptimizeCssAssetsWebpackPlugin(),

    // 直接将src下不需要特殊处理的文件，直接复制到输出目录中
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/public',
          to: 'public'
        }
      ]
    }),

    // 打包之前先删除历史文件
    new CleanWebpackPlugin()
  ],
};
