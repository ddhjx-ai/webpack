// 自定义插件
class MyPlugin {
  // webpack.config.js中引用插件是传入的参数，在options处接受
  constructor(options) {
    console.log('插件配置选项', options)
    this.options = options || {}
  }

  // 必须申明 apply 方法
  apply(compiler) {
    // 在钩子上挂载功能
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation 是此次打包的上下文
      for(const name in compilation.assets) {
        console.log(name)

        // 针对css 文件，执行相关操作(options.target 为webpack.config.js 引用自定插件时传入的参数)
        // if(name.endsWith('.css')) {
        if(name.endsWith(this.options.target)) {
          // 获取处理之前的内容
          const contents = compilation.assets[name].source()
          // 将原来的内容，通过正则表达式，删除注释(正则中的?，在这里表示非贪婪匹配)
          const newComments = contents.replace(/\/\*[\s\S]*?\*\//g, '')
          // 将处理后的结果替换掉
          compilation.assets[name] = {
            source: () => newComments,
            size: () => newComments.length
          }
        }
      }
    })
  }
}

module.exports = MyPlugin
