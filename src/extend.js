// tree shaking
// 为 Number 的原型添加一个扩展方法
Number.prototype.pad = function(x) {
  let res = this + '';
  while(res.length < x ) {
    res = '0' + res
  }
  return res 
}
// 当前模块没有导出（export） 任何成员