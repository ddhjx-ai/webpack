/* 
  webpack 打包入口文件
*/
// polyfill会转译所有的js新语法，会占用较大内存
// import '@babel/polyfill'
import $ from 'jquery'
import data from './data.json'
// console.log(data)

// 引入样式文件
import './css/main.css'
import './css/main.less'

import testMd from './test.md'
console.logff(testMd)

const fn = () => {
  alert('hello world')
}

window.fn = fn;

new Promise(resolve => {
  resolve('promise')
}).then(res => {
  console.log(res)
})

// 以模块的方式引入图片
import test from './images/mark.png'
const Img = new Image()
Img.src = test
document.body.append(Img)

// 输出API_BASE_URL
// console.log('接口地址', API_BASE_URL)

// 给body添加一个页脚(包含备案号)
$('body').append("<p>备案号：123123132213</p>")

// 验证按需加载
document.getElementById('btn').onclick = function() {
  // import() 启动懒加载
  // webpackChunkName: 'desc' 指定懒加载的名称
  // webpackPrefetch: true  启动预加载
  import(/* webpackChunkName: 'desc', webpackPrefetch: true */'./web').then(({desc}) =>{
    desc()
  })
}