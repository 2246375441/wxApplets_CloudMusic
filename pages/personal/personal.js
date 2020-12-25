// pages/personal/personal.js
let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制移动距离(页面中style中transform使用)
    coverTransForm:'translateY(0)', 
    // 是否进行平缓移动 开启是结果为 transform 1s linear
    coverTransition:'',
    // 存储用户信息
    userInfo:{},
    // 用户播放记录
    recentPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo')
    // 如果有数据则进行动态修改
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },
  // 封装方法--获取用户播放记录
  async getUserRecentPlayList(userId){
    let recentPlayListData = await request('/user/record',{uid:userId,type:0})
    let index = 0
    let NewrecentPlayList = recentPlayListData.allData.splice(0,10).map(item=>{
      item.id=index ++
      return item
    })
    this.setData({
      recentPlayList:NewrecentPlayList
    })
  },
  // 手指按下触发
  handleTouchStart(event){
    // 点击取消过渡效果
    this.setData({
      coverTransition:''
    })
    // 获取按下起始坐标
    startY = event.touches[0].clientY
  },
  // 手指按下移动触发
  handleTouchMove(event){
    // 获取移动了多少距离
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    // 控制拖动距离
    if(moveDistance<=0){
      return
    }else if(moveDistance>=80){
      moveDistance = 80
    }
    // 动态更新coverTransForm的状态值
    this.setData({
      coverTransForm:`translateY(${moveDistance}rpx)`
    })
  },
  // 手指离开触发
  handleTouchEnd(){
    // 动态更新coverTransForm的状态值
    this.setData({
      coverTransForm:`translateY(0)`,
      coverTransition:'transform 1s linear'
    })
  },
  // 点击头像跳转到登录页面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
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