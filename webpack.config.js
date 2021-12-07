// webpack配置文件
const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

// 引入自定义插件
const MyPlugin = require('./plugin/MyPlugin');

module.exports = (env, argv) => {
  const config = {
    // 打包模式
    mode: "development",
  
    // 入口文件
    // entry: "./src/index.js",
    // 多入口打包
    entry: {
      index: './src/index.js',
      about: './src/about.js'
    },
  
    // 出口配置
    output: {
      // 输出目录（输出目录必须是绝对路径）
      path: resolve(__dirname, "dist"),
      // 输出文件名称
      // filename: "main.js",
      // 多入口打包，输出时需使用动态名称
      filename: "[name].bundle.js",
    },

    // 优化策略
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
  
    // 模块配置
    module: {
      rules: [
        // 指定多个配置规则
        {
          test: /\.css$/i,
          // use 中的 loader 的加载顺序：先下后上
          use: [
            // 2.将js中的样式挂载到<style>中
            // 'style-loader',
  
            // 2.将css打包到独立的文件中
            // MiniCssExtractPlugin.loader,
  
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
  
            // 1.将css转成js
            "css-loader",
  
            // 0.通过 postcss-loader 给样式属性添加浏览器前缀
            "postcss-loader",
          ],
        },
  
        {
          test: /\.less$/i,
          use: [
            // 3.将js中的样式挂载到<style>中
            // 'style-loader',
  
            // 3.将css打包到独立的文件中
            // MiniCssExtractPlugin.loader,
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
  
            // 2.将css转成js
            "css-loader",
  
            // 1.5.通过 postcss-loader 给样式属性添加浏览器前缀
            "postcss-loader",
  
            // 1.将less转换为css
            "less-loader",
          ],
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
                    useBuiltIns: 'usage',
                    // core-js 版本
                    corejs: 3,
                    // targets: "defaults"  // 配置js运行环境
                    targets: {
                      chrome: '58',
                      ie: '9',
                      firefox: '60',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
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
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 6*1024
            }
          },
          generator: {
            // webpack5 文件后缀自动带有 .
            filename: "image/[name][ext]"
          }
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
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8*1024
            }
          },
          generator: {
            // webpack5 文件后缀自动带有 .
            filename: "font/[name][ext]"
          }
        },

        // 自定义loader
        {
          test: /\.md$/i,
          // use: './loader/markdown-loader',
          use: [
            'html-loader',
            {
              loader: './loader/markdown-loader',
              options: {
                size: 20
              }
            }
            
          ]
        }
      ],
    },
  
    // 开发服务器
    devServer: {
      // 指定加载内容的路径
      contentBase: resolve(__dirname, 'dist'),
  
      // 启用 gzip 压缩
      compress: true,
  
      // 端口号
      port: 8888,
  
      // 热更新(禁用hot)
      liveReload: true,
  
      // 接口代理：解决接口跨域
      proxy:{
        // http://localhost:8080/api
        '/api': {
          // http://localhost:8080/api/users 相当于访问 https://api.github.com/api/users
          target: "https://api.github.com",
          // http://localhost:8080/api/users 相当于访问 https://api.github.com/users
          pathRewrite: {
            '^/api': ''
          },
          // 不能使用 localhost:8080 作为请求的主机名
          changeOrigin: true,
        }
      }
    },
    // 配置目标
    target: 'web',
  
    // 插件配置
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
  
      // html 配置
      new HtmlWebpackPlugin({
        // 指定打包后的文件名称
        filename: "index.html",
        // 用来指定生成 html 的模块
        template: "./src/index.ejs",
        // 指定 html 中使用的变量
        title: "webpack首页",
        // 指定要加载的打包文件
        chunks:['index']
      }),
      // 可以同时打包多个html
      new HtmlWebpackPlugin({
        filename: "about.html",
        template: "./src/index.ejs",
        title: "关于我们",
        chunks: ['about']
      }),
  
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
      new CleanWebpackPlugin(),

      // 引入自定义插件
      new MyPlugin({
        target: '.css'
      })
    ],
  };

  // 判断当前是否是生产环境打包
  if(env.production) {
    config.mode = 'production',
    // 启用 Source Map 定位问题
    config.devtool = 'source-map'
    config.plugins = [
      new MiniCssExtractPlugin({
        // 指定打包后的css文件名
        filename: "css/[name].css",
      }),
      new StylelintPlugin({
        // 指定需要进行格式校验的文件
        files: ["src/css/*.{css,less,sass,scss}"],
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
      new CleanWebpackPlugin(),
    ]
  }

  return config
}


