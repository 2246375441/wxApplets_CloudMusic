// 发送ajax请求
/*  封装思想
* 1.封装功能函数
* 1.1功能点明确
* 1.2函数内部应该保留固定代码(静态)
* 1.3将动态的数据抽取成形参,由使用者根据自身的情况动态的传入实参
* 1.4一个良好的功能函数应该设置形参的默认值(ES6的形参默认值)

*2.封装功能组件
*2.1功能点明确
*2.2组件内部保留静态的代码
*2.3将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式动态传入props数据
*2.4一个良好的组件应该设置组件的必要性及数据类型
*
*/
// 请求域名设置在 config.js 中
import config from './config'
// 封装请求函数
export default (url,data={},method="GET") => {
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.host + url,
      data,
      method,
      success:(res)=>{
        resolve(res.data)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}