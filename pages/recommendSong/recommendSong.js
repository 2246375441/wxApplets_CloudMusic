// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:"",//月
    day:"",  //日
    recommendList:[], //推荐列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      // 未登录直接跳转至 登录页面
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          // 跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    // 更新日期的状态数据
    this.setData({
      month:new Date().getMonth() + 1,
      day:new Date().getDate()
    })

    // 获取每日推荐数据
    this.GetRecommendList()
  },
  // 获取每日推荐数据
  async GetRecommendList(){
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList:recommendListData.recommend
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