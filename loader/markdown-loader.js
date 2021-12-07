const {marked} = require('marked')

// 通过 loader-utils 插件，获取 webpack.config.js 中引用自定loader传入的参数
const loaderUtils = require('loader-utils')

// 导出函数(建议使用普通函数，否则无法拿到this对象)
module.exports = function(source) {

  // 获取 loader 的配置项
  const options = loaderUtils.getOptions(this)
  console.log('test loader', options)

  const html = marked(source)
  //  module.exports = '<h3 id="测试">测试</h3><p>这是一串测试代码</p>'
  // 直接返回，可能因为引号的问题，导致报错
  // return `module.exports = '${html}'`
  // return `module.exports = ${JSON.stringify(html)}`

  // 多个loader打包的过程，直接返回 html，交给下一个 loader 进行处理
  return html

  // loader 必须返回一个函数代码块
  // return "console.log('test loader')"
  // return 'test loader'
}