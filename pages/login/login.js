/*
*  登录流程
*    1.收集表单项数据
*    2.前端验证
*       2.1验证用户信息(账号,密码)是否合法
*       2.2验证验证不通过则通知用户,不需要发请求
*       2.3前端验证通过发请求给服务器,发请求(账号,密码)发送
*     3.后端验证
*       3.1数据库请求数据,用户是否存在
*       3.2用户不存在直接返回，告诉前端用户不存在
*       3.3用户存在则需要验证密码是否正确
*       3.4密码不正确则返回告诉前端密码不正确
*       3.5密码正确则把账号数据返回给前端,且提示用户登陆成功(携带用户账号信息)
*/
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',   //手机账号
    password:'' //密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 用户输入账号密码触发
  handleInput(event){
    // id 传值 |在input中id设置  然后从event.currentTarget.id获取进行判断 ||传独一无二的数据使用
    // let type = event.currentTarget.id
    // data-type=""传值 |在input中设置 data-key="value" 然后从event.currentTarget.dataset.key获取 ||传多个数据使用
    let type = event.currentTarget.dataset.type
    let typeValue = event.detail.value
    this.setData({
      [type]:typeValue
    })
  },
  // 登录按钮
  async login(){
    // 1收集表单项数据
    let {phone,password} = this.data
    //  ☆前端验证
    //  手机号验证
    //  1内容为空
    if(!phone){
     wx.showToast({
       title:'手机号码为空',
       icon: 'none'
     })
     return;
    }
    //  2手机号格式不正确
    //  正则匹配手机号码格式是否正确
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title:'手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    //  3手机号格式正确，验证通过
    if(!password){
      wx.showToast({
        title:'密码不能为空',
        icon: 'none'
      })
      return;
    }

    // 前端验证通过

    // 发送请求-根据服务器返回code通知用户结果
    let result = await request('/login/cellphone',{phone,password})
    // console.log(result)
    if(result.code===200){
      // 登录成功200
      // 提示登录成功
      wx.showToast({
        title:'登陆成功',
        icon: 'none'
      })
      // 将用户的信息存储到本地  JSON.stringify()将对象转换为 字符串
      wx.setStorageSync('userInfo',JSON.stringify(result.profile))

      // 跳转到个人界面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(result.code===400){
      // 手机号错误400
      wx.showToast({
        title:'手机号错误',
        icon: 'none'
      })
    }else if(result.code===501){
      // 账号不存在501
      wx.showToast({
        title:'账号不存在',
        icon: 'none'
      })
    }else if(result.code===502){
      // 密码错误502
      wx.showToast({
        title:'密码错误',
        icon: 'none'
      })
    }else{
      // 当前状态码有问题,登录失败
      wx.showToast({
        title:'请重新登录',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})